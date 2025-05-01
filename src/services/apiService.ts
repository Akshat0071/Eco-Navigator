import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const API_BASE_URL = '/api/ai';

class ApiService {
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'User-ID': 'user-123', // In a real app, this would come from auth
      };

      const options: RequestInit = {
        method,
        headers,
        credentials: 'include',
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        logger.error('API Error:', { 
          status: response.status, 
          endpoint, 
          error: responseData.error 
        });
        
        return {
          error: responseData.error || 'An error occurred',
          code: responseData.code,
          retryable: responseData.retryable
        };
      }

      return { data: responseData };
    } catch (error) {
      logger.error('API Request Failed:', { endpoint, error });
      return {
        error: 'Network error or server is unavailable',
        retryable: true
      };
    }
  }

  // Workout Plan
  async generateWorkoutPlan(params: {
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    preferences: string[];
    restrictions: string[];
  }) {
    return this.request('/workout-plan', 'POST', params);
  }

  // Meal Plan
  async generateMealPlan(params: {
    dietaryRestrictions: string[];
    calorieGoal: number;
    cuisine: string[];
    allergies: string[];
  }) {
    return this.request('/meal-plan', 'POST', params);
  }

  // Eco Score
  async calculateEcoScore(params: {
    activities: Array<{
      type: string;
      frequency: number;
      impact: number;
    }>;
    habits: Array<{
      name: string;
      frequency: string;
      impact: number;
    }>;
    consumption: Array<{
      category: string;
      amount: number;
      unit: string;
    }>;
  }) {
    return this.request('/eco-score', 'POST', params);
  }

  // Activity Recommendations
  async getActivityRecommendations(params: {
    interests: string[];
    location: string;
    availableTime: number;
    currentActivities: string[];
  }) {
    return this.request('/activity-recommendations', 'POST', params);
  }
}

export const apiService = new ApiService(); 