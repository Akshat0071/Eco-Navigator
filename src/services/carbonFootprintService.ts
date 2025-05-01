import { LRUCache } from 'lru-cache';
import { logger } from '../utils/logger';

// Get environment variables
const CARBON_FOOTPRINT_API_KEY = import.meta.env.VITE_CARBON_FOOTPRINT_API_KEY || '';
const CARBON_FOOTPRINT_BASE_URL = 'https://api.carbonfootprint.com/v1';

// Cache configuration
const CACHE_CONFIG = {
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
  updateAgeOnGet: true
};

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: 'Too many requests, please try again later.'
};

// Retry Configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffFactor: 2
};

// Create cache instance
const carbonFootprintCache = new LRUCache<string, CarbonFootprintResponse>(CACHE_CONFIG);

// Request tracking for rate limiting
const requestTracker = new Map<string, number[]>();

// Types
export interface CarbonFootprintRequest {
  activity: string;
  value: number;
  unit: string;
  country?: string;
  region?: string;
}

export interface CarbonFootprintResponse {
  carbonKg: number;
  carbonLb: number;
  carbonMt: number;
  activity: string;
  value: number;
  unit: string;
  country?: string;
  region?: string;
  timestamp: number;
  recommendations: string[];
}

// Custom error class
export class CarbonFootprintServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'CarbonFootprintServiceError';
  }
}

class CarbonFootprintService {
  private maxRetries: number;
  private initialDelay: number;
  private maxDelay: number;
  private backoffFactor: number;

  constructor() {
    this.maxRetries = RETRY_CONFIG.maxRetries;
    this.initialDelay = RETRY_CONFIG.initialDelay;
    this.maxDelay = RETRY_CONFIG.maxDelay;
    this.backoffFactor = RETRY_CONFIG.backoffFactor;
  }

  private checkApiKey() {
    if (!CARBON_FOOTPRINT_API_KEY) {
      throw new CarbonFootprintServiceError(
        'Carbon Footprint API key is not configured. Please add VITE_CARBON_FOOTPRINT_API_KEY to your .env file.',
        'API_NOT_CONFIGURED',
        500,
        false
      );
    }
  }

  private async checkRateLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const userRequests = requestTracker.get(userId) || [];
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT.windowMs);
    
    if (recentRequests.length >= RATE_LIMIT.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    requestTracker.set(userId, recentRequests);
    return true;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoff(attempt: number): number {
    const delay = Math.min(
      this.initialDelay * Math.pow(this.backoffFactor, attempt - 1),
      this.maxDelay
    );
    return delay + Math.random() * 1000; // Add jitter
  }

  private async makeRequestWithRetry<T extends CarbonFootprintResponse>(
    requestFn: () => Promise<T>,
    cacheKey: string,
    userId: string
  ): Promise<T> {
    // Check rate limit
    if (!(await this.checkRateLimit(userId))) {
      throw new CarbonFootprintServiceError(
        RATE_LIMIT.message,
        'RATE_LIMIT_EXCEEDED',
        429,
        true
      );
    }

    // Check cache
    const cachedResponse = carbonFootprintCache.get(cacheKey);
    if (cachedResponse) {
      logger.info(`Cache hit for key: ${cacheKey}`);
      return cachedResponse as T;
    }

    // Make request with retry logic
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await requestFn();
        carbonFootprintCache.set(cacheKey, response);
        return response;
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`Attempt ${attempt} failed: ${lastError.message}`);
        
        if (attempt < this.maxRetries) {
          const backoffDelay = this.calculateBackoff(attempt);
          await this.delay(backoffDelay);
        }
      }
    }

    logger.error(`All retry attempts failed: ${lastError?.message}`);
    throw new CarbonFootprintServiceError(
      'Request failed after multiple attempts',
      'MAX_RETRIES_EXCEEDED',
      500,
      false
    );
  }

  async calculateCarbonFootprint(request: CarbonFootprintRequest, userId: string): Promise<CarbonFootprintResponse> {
    this.checkApiKey();
    const cacheKey = `carbon-${request.activity}-${request.value}-${request.unit}-${request.country || 'global'}-${request.region || 'global'}`;
    
    return this.makeRequestWithRetry(
      async () => {
        const url = `${CARBON_FOOTPRINT_BASE_URL}/calculate`;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CARBON_FOOTPRINT_API_KEY}`
        };
        
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(request)
        });

        if (!response.ok) {
          throw new CarbonFootprintServiceError(
            `Carbon Footprint API error: ${response.statusText}`,
            'API_ERROR',
            response.status,
            response.status >= 500
          );
        }

        const data = await response.json();
        
        // Generate recommendations based on the activity and carbon footprint
        const recommendations = this.generateRecommendations(request.activity, data.carbonKg);
        
        return {
          ...data,
          timestamp: Date.now(),
          recommendations
        };
      },
      cacheKey,
      userId
    );
  }

  private generateRecommendations(activity: string, carbonKg: number): string[] {
    const recommendations: string[] = [];
    
    // Add activity-specific recommendations
    switch (activity.toLowerCase()) {
      case 'transport':
        if (carbonKg > 10) {
          recommendations.push('Consider using public transportation or carpooling');
          recommendations.push('Look into electric or hybrid vehicles');
        }
        break;
      case 'energy':
        if (carbonKg > 5) {
          recommendations.push('Switch to renewable energy sources');
          recommendations.push('Install energy-efficient appliances');
        }
        break;
      case 'food':
        if (carbonKg > 3) {
          recommendations.push('Reduce meat consumption');
          recommendations.push('Buy local and seasonal produce');
        }
        break;
      default:
        if (carbonKg > 5) {
          recommendations.push('Look for ways to reduce your carbon footprint');
          recommendations.push('Consider offsetting your emissions');
        }
    }
    
    // Add general recommendations based on carbon amount
    if (carbonKg > 20) {
      recommendations.push('Your carbon footprint is significantly high. Consider making major lifestyle changes.');
    } else if (carbonKg > 10) {
      recommendations.push('Your carbon footprint is above average. Look for opportunities to reduce emissions.');
    } else {
      recommendations.push('Keep up the good work! Your carbon footprint is relatively low.');
    }
    
    return recommendations;
  }
}

// Create a singleton instance
let carbonFootprintServiceInstance: CarbonFootprintService | null = null;

try {
  carbonFootprintServiceInstance = new CarbonFootprintService();
} catch (error) {
  console.error('Error creating CarbonFootprintService instance:', error);
}

export const carbonFootprintService = carbonFootprintServiceInstance; 