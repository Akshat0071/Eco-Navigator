import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { LRUCache } from 'lru-cache';
import { logger } from '../utils/logger';
import {
  validateWorkoutPlanRequest,
  validateActivityRecommendationRequest,
  validateMealPlanRequest,
  validateEcoScoreRequest
} from '../utils/validation';

// Get environment variables directly from import.meta.env
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Add detailed logging
console.log('Environment variables:', {
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  VITE_GEMINI_API_KEY_LENGTH: import.meta.env.VITE_GEMINI_API_KEY?.length,
  ALL_ENV_KEYS: Object.keys(import.meta.env)
});

// Initialize the Gemini API
let genAI: GoogleGenerativeAI | null = null;

try {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key is not configured. AI features will be disabled.');
  } else {
    // Initialize with the API key
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Log the API key length (not the actual key) for debugging
    logger.info(`Using Gemini API key of length: ${GEMINI_API_KEY.length}`);
  }
} catch (error) {
  console.error('Error initializing Gemini API:', error);
}

// Cache configuration
const CACHE_CONFIG = {
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
  updateAgeOnGet: true
};

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: 'Too many requests, please try again later.'
};

// AI Model Configuration
const AI_CONFIG = {
  model: 'gemini-1.5-pro',
  temperature: 0.7,
  maxOutputTokens: 2048,
  topP: 0.8,
  topK: 40
};

// Retry Configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffFactor: 2
};

// Feature Flags
const FEATURES = {
  enableCaching: true,
  enableRateLimiting: true,
  enableRetries: true,
  enableLogging: true
};

// Create cache instances for different types of requests
const workoutPlanCache = new LRUCache<string, WorkoutPlanResponse[]>(CACHE_CONFIG);
const activityRecommendationCache = new LRUCache<string, ActivityRecommendationResponse[]>(CACHE_CONFIG);
const ecoScoreCache = new LRUCache<string, EcoScoreResponse>(CACHE_CONFIG);
const mealPlanCache = new LRUCache<string, MealPlanResponse>(CACHE_CONFIG);

// Request tracking for rate limiting
const requestTracker = new Map<string, number[]>();

// Custom error class for Gemini service
export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public retryable: boolean = true,
    public validationErrors?: string[]
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

// Types for workout plan generation
export interface WorkoutPlanRequest {
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preferences: string[];
  restrictions: string[];
}

export interface WorkoutPlanResponse {
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    rest: number;
    notes: string;
  }[];
  equipment: string[];
  calories: number;
  ecoImpact: number;
  steps: string[];
  tips: string[];
}

// Types for activity recommendations
export interface ActivityRecommendationRequest {
  interests: string[];
  location: string;
  availableTime: number;
  currentActivities: string[];
}

export interface ActivityRecommendationResponse {
  description: string;
  ecoImpact: number;
  suggestions: string[];
}

// Types for eco-score analysis
export interface EcoScoreRequest {
  activities: {
    type: string;
    frequency: number;
    impact: number;
  }[];
  habits: {
    name: string;
    frequency: string;
    impact: number;
  }[];
  consumption: {
    category: string;
    amount: number;
    unit: string;
  }[];
}

export interface EcoScoreResponse {
  score: number;
  breakdown: {
    category: string;
    score: number;
    suggestions: string[];
  }[];
  recommendations: string[];
  trends: {
    category: string;
    trend: 'improving' | 'declining' | 'stable';
    percentage: number;
  }[];
}

// Types for meal plan generation
export interface MealPlanRequest {
  dietaryRestrictions: string[];
  calorieGoal: number;
  cuisine: string[];
  allergies: string[];
}

export interface MealPlanResponse {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ecoScore: number;
  carbonFootprint: number;
}

class GeminiService {
  private model: GenerativeModel | null = null;
  private maxRetries: number;
  private initialDelay: number;
  private maxDelay: number;
  private backoffFactor: number;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: AI_CONFIG.model });
    }
    this.maxRetries = RETRY_CONFIG.maxRetries;
    this.initialDelay = RETRY_CONFIG.initialDelay;
    this.maxDelay = RETRY_CONFIG.maxDelay;
    this.backoffFactor = RETRY_CONFIG.backoffFactor;
  }

  private checkAIAvailability() {
    if (!this.model) {
      throw new GeminiServiceError(
        'Gemini API is not configured. Please add VITE_GEMINI_API_KEY to your .env file.',
        'API_NOT_CONFIGURED',
        500,
        false
      );
    }
  }

  private async checkRateLimit(userId: string): Promise<boolean> {
    if (!FEATURES.enableRateLimiting) return true;

    const now = Date.now();
    const userRequests = requestTracker.get(userId) || [];
    
    // Remove old requests
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT.windowMs);
    
    if (recentRequests.length >= RATE_LIMIT.maxRequests) {
      logger.warn(`Rate limit exceeded for user ${userId}`);
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
    cache: LRUCache<string, T>,
    userId: string
  ): Promise<T> {
    // Check rate limit
    if (!(await this.checkRateLimit(userId))) {
      throw new GeminiServiceError(
        RATE_LIMIT.message,
        'RATE_LIMIT_EXCEEDED',
        429,
        true
      );
    }

    // Check cache if enabled
    if (FEATURES.enableCaching) {
      const cachedResponse = cache.get(cacheKey);
      if (cachedResponse) {
        logger.info(`Cache hit for key: ${cacheKey}`);
        return cachedResponse;
      }
    }

    // Make request with retry logic
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await requestFn();
        if (FEATURES.enableCaching) {
          cache.set(cacheKey, response);
        }
        return response;
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`Attempt ${attempt} failed: ${lastError.message}`);
        
        if (attempt < this.maxRetries && FEATURES.enableRetries) {
          const backoffDelay = this.calculateBackoff(attempt);
          await this.delay(backoffDelay);
        }
      }
    }

    logger.error(`All retry attempts failed: ${lastError?.message}`);
    throw new GeminiServiceError(
      'Request failed after multiple attempts',
      'MAX_RETRIES_EXCEEDED',
      500,
      false
    );
  }

  private async generateContent(prompt: string): Promise<string> {
    this.checkAIAvailability();
    
    try {
      // Log the API key length (not the actual key) for debugging
      logger.info(`Using Gemini API key of length: ${GEMINI_API_KEY.length}`);
      
      const result = await this.model!.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: AI_CONFIG.temperature,
          maxOutputTokens: AI_CONFIG.maxOutputTokens,
          topP: AI_CONFIG.topP,
          topK: AI_CONFIG.topK,
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error: any) {
      // Enhanced error logging
      logger.error('Error generating content:', {
        error: error.message,
        status: error.status,
        statusText: error.statusText,
        code: error.code,
        details: error.details
      });
      
      // Check for specific error types
      if (error.status === 404) {
        throw new GeminiServiceError(
          'Gemini API endpoint not found. Please check your API key and model configuration.',
          'API_ENDPOINT_NOT_FOUND',
          404,
          false
        );
      } else if (error.status === 401 || error.status === 403) {
        throw new GeminiServiceError(
          'Authentication failed. Please check your API key.',
          'AUTHENTICATION_FAILED',
          error.status,
          false
        );
      } else if (error.status === 429) {
        throw new GeminiServiceError(
          'Rate limit exceeded. Please try again later.',
          'RATE_LIMIT_EXCEEDED',
          429,
          true
        );
      } else {
        throw new GeminiServiceError(
          `Failed to generate content: ${error.message || 'Unknown error'}`,
          'GENERATION_FAILED',
          500,
          true
        );
      }
    }
  }

  async generateWorkoutPlan(request: WorkoutPlanRequest, userId: string): Promise<WorkoutPlanResponse[]> {
    const cacheKey = `workout-${JSON.stringify(request)}`;
    
    // Validate and sanitize request
    const validatedRequest = validateWorkoutPlanRequest(request);
    
    return this.makeRequestWithRetry(
      async () => {
        const prompt = `Generate a ${validatedRequest.difficulty} level workout plan for ${validatedRequest.duration} minutes.
          Consider these preferences: ${validatedRequest.preferences.join(', ')}
          And these restrictions: ${validatedRequest.restrictions.join(', ')}
          Include eco-friendly tips and sustainable practices.
          Format the response as a JSON object with the following structure:
          {
            "name": "string",
            "steps": ["string"],
            "tips": ["string"]
          }`;

        const response = await this.generateContent(prompt);
        try {
          return JSON.parse(response);
        } catch (error) {
          throw new GeminiServiceError(
            'Failed to parse workout plan response',
            'PARSE_ERROR',
            500,
            false
          );
        }
      },
      cacheKey,
      workoutPlanCache,
      userId
    );
  }

  async generateActivityRecommendations(
    request: ActivityRecommendationRequest,
    userId: string
  ): Promise<ActivityRecommendationResponse[]> {
    const cacheKey = `activity-${JSON.stringify(request)}`;
    
    // Validate and sanitize request
    const validatedRequest = validateActivityRecommendationRequest(request);
    
    return this.makeRequestWithRetry(
      async () => {
        const prompt = `Generate eco-friendly activity recommendations for someone interested in ${validatedRequest.interests.join(', ')}.
          Location: ${validatedRequest.location}
          Available time: ${validatedRequest.availableTime} minutes
          Current activities: ${validatedRequest.currentActivities.join(', ')}
          
          Please provide:
          1. A description of each recommended activity
          2. The eco-impact score (0-100) for each activity
          3. Specific suggestions for implementation
          
          Format the response as a JSON array with the following structure:
          [
            {
              "description": "string",
              "ecoImpact": number,
              "suggestions": ["string"]
            }
          ]`;

        const response = await this.generateContent(prompt);
        try {
          return JSON.parse(response);
        } catch (error) {
          throw new GeminiServiceError(
            'Failed to parse activity recommendations response',
            'PARSE_ERROR',
            500,
            false
          );
        }
      },
      cacheKey,
      activityRecommendationCache,
      userId
    );
  }

  async calculateEcoScore(request: EcoScoreRequest, userId: string): Promise<EcoScoreResponse> {
    const cacheKey = `ecoscore-${JSON.stringify(request)}`;
    
    // Validate and sanitize request
    const validatedRequest = validateEcoScoreRequest(request);
    
    return this.makeRequestWithRetry(
      async () => {
        const prompt = `Analyze the following user data and calculate an eco-score:
          Activities: ${JSON.stringify(validatedRequest.activities)}
          Habits: ${JSON.stringify(validatedRequest.habits)}
          Consumption: ${JSON.stringify(validatedRequest.consumption)}
          
          Please provide:
          1. Overall eco-score (0-100)
          2. Breakdown by category with scores and suggestions
          3. Specific recommendations for improvement
          4. Trend analysis for each category
          
          Format the response as a JSON object with the following structure:
          {
            "score": number,
            "breakdown": [
              {
                "category": "string",
                "score": number,
                "suggestions": ["string"]
              }
            ],
            "recommendations": ["string"],
            "trends": [
              {
                "category": "string",
                "trend": "improving" | "declining" | "stable",
                "percentage": number
              }
            ]
          }`;

        const response = await this.generateContent(prompt);
        try {
          return JSON.parse(response);
        } catch (error) {
          throw new GeminiServiceError(
            'Failed to parse eco-score response',
            'PARSE_ERROR',
            500,
            false
          );
        }
      },
      cacheKey,
      ecoScoreCache,
      userId
    );
  }

  async generateMealPlan(request: MealPlanRequest, userId: string): Promise<MealPlanResponse> {
    const cacheKey = `mealplan-${JSON.stringify(request)}`;
    
    // Validate and sanitize request
    const validatedRequest = validateMealPlanRequest(request);
    
    return this.makeRequestWithRetry(
      async () => {
        const prompt = `Generate a personalized meal plan with the following preferences:
          - Dietary Restrictions: ${validatedRequest.dietaryRestrictions.join(', ')}
          - Calorie Goal: ${validatedRequest.calorieGoal}
          - Cuisine Preferences: ${validatedRequest.cuisine.join(', ')}
          - Allergies: ${validatedRequest.allergies.join(', ')}
          
          Please provide a detailed meal plan including:
          1. Meal name and description
          2. List of ingredients
          3. Step-by-step instructions
          4. Nutritional information (calories, protein, carbs, fat)
          5. Eco-score (0-100) and carbon footprint (kg CO2)
          
          Format the response as a JSON object with the following structure:
          {
            "name": "string",
            "description": "string",
            "ingredients": ["string"],
            "instructions": ["string"],
            "nutritionalInfo": {
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number
            },
            "ecoScore": number,
            "carbonFootprint": number
          }`;

        const response = await this.generateContent(prompt);
        try {
          return JSON.parse(response);
        } catch (error) {
          throw new GeminiServiceError(
            'Failed to parse meal plan response',
            'PARSE_ERROR',
            500,
            false
          );
        }
      },
      cacheKey,
      mealPlanCache,
      userId
    );
  }
}

// Create a singleton instance with error handling
let geminiServiceInstance: GeminiService | null = null;

try {
  geminiServiceInstance = new GeminiService();
} catch (error) {
  console.error('Error creating GeminiService instance:', error);
}

export const geminiService = geminiServiceInstance; 