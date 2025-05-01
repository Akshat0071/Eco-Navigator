import { LRUCache } from 'lru-cache';
import { logger } from '../utils/logger';

// Get environment variables
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache configuration
const CACHE_CONFIG = {
  max: 100,
  ttl: 1000 * 60 * 30, // 30 minutes
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
const weatherCache = new LRUCache<string, WeatherResponse>(CACHE_CONFIG);
const airQualityCache = new LRUCache<string, AirQualityResponse>(CACHE_CONFIG);

// Request tracking for rate limiting
const requestTracker = new Map<string, number[]>();

// Types
export interface WeatherRequest {
  lat: number;
  lon: number;
  units?: 'metric' | 'imperial';
}

export interface WeatherResponse {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  timestamp: number;
  recommendations: string[];
}

export interface AirQualityRequest {
  lat: number;
  lon: number;
}

export interface AirQualityResponse {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  timestamp: number;
  recommendations: string[];
}

// Custom error class
export class OpenWeatherServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'OpenWeatherServiceError';
  }
}

class OpenWeatherService {
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
    if (!OPENWEATHER_API_KEY) {
      throw new OpenWeatherServiceError(
        'OpenWeather API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.',
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

  private async makeRequestWithRetry<T extends object>(
    requestFn: () => Promise<T>,
    cacheKey: string,
    userId: string,
    cache: LRUCache<string, T>
  ): Promise<T> {
    // Check rate limit
    if (!(await this.checkRateLimit(userId))) {
      throw new OpenWeatherServiceError(
        RATE_LIMIT.message,
        'RATE_LIMIT_EXCEEDED',
        429,
        true
      );
    }

    // Check cache
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      logger.info(`Cache hit for key: ${cacheKey}`);
      return cachedResponse;
    }

    // Make request with retry logic
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await requestFn();
        cache.set(cacheKey, response);
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
    throw new OpenWeatherServiceError(
      'Request failed after multiple attempts',
      'MAX_RETRIES_EXCEEDED',
      500,
      false
    );
  }

  async getWeather(request: WeatherRequest, userId: string): Promise<WeatherResponse> {
    this.checkApiKey();
    const units = request.units || 'metric';
    const cacheKey = `weather-${request.lat}-${request.lon}-${units}`;
    
    return this.makeRequestWithRetry(
      async () => {
        const url = `${OPENWEATHER_BASE_URL}/weather?lat=${request.lat}&lon=${request.lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new OpenWeatherServiceError(
            `OpenWeather API error: ${response.statusText}`,
            'API_ERROR',
            response.status,
            response.status >= 500
          );
        }

        const data = await response.json();
        
        // Generate recommendations based on weather conditions
        const recommendations = this.generateWeatherRecommendations(data, units);
        
        return {
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
          windDirection: data.wind.deg,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          timestamp: Date.now(),
          recommendations
        };
      },
      cacheKey,
      userId,
      weatherCache
    );
  }

  async getAirQuality(request: AirQualityRequest, userId: string): Promise<AirQualityResponse> {
    this.checkApiKey();
    const cacheKey = `air-${request.lat}-${request.lon}`;
    
    return this.makeRequestWithRetry(
      async () => {
        const url = `${OPENWEATHER_BASE_URL}/air_pollution?lat=${request.lat}&lon=${request.lon}&appid=${OPENWEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new OpenWeatherServiceError(
            `OpenWeather API error: ${response.statusText}`,
            'API_ERROR',
            response.status,
            response.status >= 500
          );
        }

        const data = await response.json();
        
        // Generate recommendations based on air quality
        const recommendations = this.generateAirQualityRecommendations(data);
        
        return {
          aqi: data.list[0].main.aqi,
          pm25: data.list[0].components.pm2_5,
          pm10: data.list[0].components.pm10,
          o3: data.list[0].components.o3,
          no2: data.list[0].components.no2,
          so2: data.list[0].components.so2,
          co: data.list[0].components.co,
          timestamp: Date.now(),
          recommendations
        };
      },
      cacheKey,
      userId,
      airQualityCache
    );
  }

  private generateWeatherRecommendations(data: any, units: string): string[] {
    const recommendations: string[] = [];
    const temp = data.main.temp;
    const weatherId = data.weather[0].id;
    const windSpeed = data.wind.speed;
    
    // Temperature-based recommendations
    if (units === 'metric') {
      if (temp < 0) {
        recommendations.push('Stay warm and dress in layers');
        recommendations.push('Be careful of icy conditions');
      } else if (temp > 30) {
        recommendations.push('Stay hydrated and avoid prolonged sun exposure');
        recommendations.push('Consider indoor activities during peak hours');
      }
    } else {
      if (temp < 32) {
        recommendations.push('Stay warm and dress in layers');
        recommendations.push('Be careful of icy conditions');
      } else if (temp > 86) {
        recommendations.push('Stay hydrated and avoid prolonged sun exposure');
        recommendations.push('Consider indoor activities during peak hours');
      }
    }
    
    // Weather condition recommendations
    if (weatherId >= 200 && weatherId < 300) {
      recommendations.push('Bring an umbrella and wear waterproof clothing');
    } else if (weatherId >= 300 && weatherId < 400) {
      recommendations.push('Light rain expected, consider bringing an umbrella');
    } else if (weatherId >= 500 && weatherId < 600) {
      recommendations.push('Heavy rain expected, stay indoors if possible');
    } else if (weatherId >= 600 && weatherId < 700) {
      recommendations.push('Snow expected, dress warmly and be careful of slippery conditions');
    } else if (weatherId >= 700 && weatherId < 800) {
      recommendations.push('Atmospheric conditions may affect visibility, take precautions');
    }
    
    // Wind-based recommendations
    if (windSpeed > 20) {
      recommendations.push('Strong winds expected, secure loose objects');
    } else if (windSpeed > 10) {
      recommendations.push('Moderate winds, be mindful of wind chill');
    }
    
    return recommendations;
  }

  private generateAirQualityRecommendations(data: any): string[] {
    const recommendations: string[] = [];
    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;
    
    // AQI-based recommendations
    switch (aqi) {
      case 1:
        recommendations.push('Air quality is good. Perfect conditions for outdoor activities.');
        break;
      case 2:
        recommendations.push('Air quality is fair. Sensitive individuals should consider reducing outdoor activities.');
        break;
      case 3:
        recommendations.push('Air quality is moderate. Consider reducing outdoor activities, especially for sensitive groups.');
        break;
      case 4:
        recommendations.push('Air quality is poor. Limit outdoor activities and keep windows closed.');
        break;
      case 5:
        recommendations.push('Air quality is very poor. Avoid outdoor activities and use air purifiers indoors.');
        break;
    }
    
    // Component-specific recommendations
    if (components.pm2_5 > 35) {
      recommendations.push('High PM2.5 levels detected. Consider wearing a mask outdoors.');
    }
    if (components.pm10 > 150) {
      recommendations.push('High PM10 levels detected. Avoid strenuous outdoor activities.');
    }
    if (components.o3 > 100) {
      recommendations.push('High ozone levels detected. Plan outdoor activities for early morning or evening.');
    }
    if (components.no2 > 200) {
      recommendations.push('High nitrogen dioxide levels detected. Consider using public transportation.');
    }
    if (components.so2 > 100) {
      recommendations.push('High sulfur dioxide levels detected. Stay indoors if possible.');
    }
    if (components.co > 7) {
      recommendations.push('High carbon monoxide levels detected. Ensure proper ventilation.');
    }
    
    return recommendations;
  }
}

// Create a singleton instance
let openWeatherServiceInstance: OpenWeatherService | null = null;

try {
  openWeatherServiceInstance = new OpenWeatherService();
} catch (error) {
  console.error('Error creating OpenWeatherService instance:', error);
}

export const openWeatherService = openWeatherServiceInstance; 