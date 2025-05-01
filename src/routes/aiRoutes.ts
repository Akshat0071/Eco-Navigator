import express, { Request, Response, NextFunction } from 'express';
import { geminiService, GeminiServiceError } from '../services/geminiService';
import { logger } from '../utils/logger';

const router = express.Router();

// Middleware to validate user authentication
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // In a real app, you would verify JWT tokens or session
  const userId = req.headers['user-id'] as string || 'anonymous';
  req.userId = userId;
  next();
};

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('API Error:', { error: err.message, path: req.path });
  
  if (err instanceof GeminiServiceError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      retryable: err.retryable,
      validationErrors: err.validationErrors
    });
    return;
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Generate workout plan
router.post('/workout-plan', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!geminiService) {
      throw new GeminiServiceError(
        'Gemini service is not available',
        'SERVICE_UNAVAILABLE',
        503,
        false
      );
    }

    const { duration, difficulty, preferences, restrictions } = req.body;
    
    // Validate request
    if (!duration || !difficulty || !Array.isArray(preferences) || !Array.isArray(restrictions)) {
      res.status(400).json({
        error: 'Invalid request parameters',
        details: 'Missing required fields or invalid data types'
      });
      return;
    }
    
    const result = await geminiService.generateWorkoutPlan(
      { duration, difficulty, preferences, restrictions },
      req.userId
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Generate meal plan
router.post('/meal-plan', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!geminiService) {
      throw new GeminiServiceError(
        'Gemini service is not available',
        'SERVICE_UNAVAILABLE',
        503,
        false
      );
    }

    const { dietaryRestrictions, calorieGoal, cuisine, allergies } = req.body;
    
    // Validate request
    if (!Array.isArray(dietaryRestrictions) || !calorieGoal || !Array.isArray(cuisine) || !Array.isArray(allergies)) {
      res.status(400).json({
        error: 'Invalid request parameters',
        details: 'Missing required fields or invalid data types'
      });
      return;
    }
    
    const result = await geminiService.generateMealPlan(
      { dietaryRestrictions, calorieGoal, cuisine, allergies },
      req.userId
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Calculate eco-score
router.post('/eco-score', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!geminiService) {
      throw new GeminiServiceError(
        'Gemini service is not available',
        'SERVICE_UNAVAILABLE',
        503,
        false
      );
    }

    const { activities, habits, consumption } = req.body;
    
    // Validate request
    if (!Array.isArray(activities) || !Array.isArray(habits) || !Array.isArray(consumption)) {
      res.status(400).json({
        error: 'Invalid request parameters',
        details: 'Missing required fields or invalid data types'
      });
      return;
    }
    
    const result = await geminiService.calculateEcoScore(
      { activities, habits, consumption },
      req.userId
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Generate activity recommendations
router.post('/activity-recommendations', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!geminiService) {
      throw new GeminiServiceError(
        'Gemini service is not available',
        'SERVICE_UNAVAILABLE',
        503,
        false
      );
    }

    const { interests, location, availableTime, currentActivities } = req.body;
    
    // Validate request
    if (!Array.isArray(interests) || !location || !availableTime || !Array.isArray(currentActivities)) {
      res.status(400).json({
        error: 'Invalid request parameters',
        details: 'Missing required fields or invalid data types'
      });
      return;
    }
    
    const result = await geminiService.generateActivityRecommendations(
      { interests, location, availableTime, currentActivities },
      req.userId
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Apply error handling middleware
router.use(errorHandler);

export default router; 