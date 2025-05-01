import axios from 'axios';
import { logger } from '@/utils/logger';
import { ApiResponse } from '../types';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    logger.info(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    logger.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

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

// AI Service Functions
export const generateMealPlan = async (preferences: any) => {
  try {
    const response = await api.post('/ai/meal-plan', preferences);
    return response.data;
  } catch (error) {
    logger.error('Error generating meal plan:', error);
    throw error;
  }
};

export const generateWorkoutPlan = async (fitnessLevel: string, goals: string[]) => {
  try {
    const response = await api.post('/ai/workout-plan', { fitnessLevel, goals });
    return response.data;
  } catch (error) {
    logger.error('Error generating workout plan:', error);
    throw error;
  }
};

export const getSustainabilityTips = async () => {
  try {
    const response = await api.get('/ai/sustainability-tips');
    return response.data;
  } catch (error) {
    logger.error('Error getting sustainability tips:', error);
    throw error;
  }
};

// User Service Functions
export const register = async (userData: any) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    logger.error('Error registering user:', error);
    throw error;
  }
};

export const login = async (credentials: any) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    logger.error('Error logging in:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    logger.error('Error getting profile:', error);
    throw error;
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    logger.error('Error updating profile:', error);
    throw error;
  }
};

export default api; 