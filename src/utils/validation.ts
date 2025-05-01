import { GeminiServiceError } from '../services/geminiService';

// Validation ranges and limits
export const VALIDATION_LIMITS = {
  WORKOUT: {
    MIN_DURATION: 5,
    MAX_DURATION: 180,
    MIN_PREFERENCES: 1,
    MAX_PREFERENCES: 10,
    MAX_PREFERENCE_LENGTH: 50,
    MAX_RESTRICTIONS: 5,
    MAX_RESTRICTION_LENGTH: 100
  },
  ACTIVITY: {
    MIN_TIME: 15,
    MAX_TIME: 480,
    MIN_INTERESTS: 1,
    MAX_INTERESTS: 10,
    MAX_INTEREST_LENGTH: 50,
    MAX_LOCATION_LENGTH: 100,
    MAX_CURRENT_ACTIVITIES: 20,
    MAX_ACTIVITY_LENGTH: 50
  },
  MEAL: {
    MIN_CALORIES: 500,
    MAX_CALORIES: 5000,
    MIN_CUISINES: 1,
    MAX_CUISINES: 5,
    MAX_CUISINE_LENGTH: 30,
    MAX_RESTRICTIONS: 10,
    MAX_RESTRICTION_LENGTH: 50,
    MAX_ALLERGIES: 10,
    MAX_ALLERGY_LENGTH: 30
  },
  ECO_SCORE: {
    MIN_ACTIVITIES: 1,
    MAX_ACTIVITIES: 20,
    MIN_HABITS: 1,
    MAX_HABITS: 15,
    MIN_CONSUMPTION: 1,
    MAX_CONSUMPTION: 20
  }
};

// Sanitization functions
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
};

export const sanitizeArray = (arr: string[]): string[] => {
  return arr.map(item => sanitizeString(item)).filter(item => item.length > 0);
};

// Validation functions
export const validateWorkoutPlanRequest = (request: any) => {
  const errors: string[] = [];

  // Validate duration
  if (!Number.isInteger(request.duration) || 
      request.duration < VALIDATION_LIMITS.WORKOUT.MIN_DURATION || 
      request.duration > VALIDATION_LIMITS.WORKOUT.MAX_DURATION) {
    errors.push(`Duration must be between ${VALIDATION_LIMITS.WORKOUT.MIN_DURATION} and ${VALIDATION_LIMITS.WORKOUT.MAX_DURATION} minutes`);
  }

  // Validate difficulty
  if (!['beginner', 'intermediate', 'advanced'].includes(request.difficulty)) {
    errors.push('Difficulty must be one of: beginner, intermediate, advanced');
  }

  // Validate preferences
  if (!Array.isArray(request.preferences)) {
    errors.push('Preferences must be an array');
  } else {
    if (request.preferences.length < VALIDATION_LIMITS.WORKOUT.MIN_PREFERENCES) {
      errors.push(`At least ${VALIDATION_LIMITS.WORKOUT.MIN_PREFERENCES} preference is required`);
    }
    if (request.preferences.length > VALIDATION_LIMITS.WORKOUT.MAX_PREFERENCES) {
      errors.push(`Maximum ${VALIDATION_LIMITS.WORKOUT.MAX_PREFERENCES} preferences allowed`);
    }
    request.preferences.forEach((pref: string, index: number) => {
      if (typeof pref !== 'string' || pref.length > VALIDATION_LIMITS.WORKOUT.MAX_PREFERENCE_LENGTH) {
        errors.push(`Preference ${index + 1} must be a string of maximum ${VALIDATION_LIMITS.WORKOUT.MAX_PREFERENCE_LENGTH} characters`);
      }
    });
  }

  // Validate restrictions
  if (!Array.isArray(request.restrictions)) {
    errors.push('Restrictions must be an array');
  } else {
    if (request.restrictions.length > VALIDATION_LIMITS.WORKOUT.MAX_RESTRICTIONS) {
      errors.push(`Maximum ${VALIDATION_LIMITS.WORKOUT.MAX_RESTRICTIONS} restrictions allowed`);
    }
    request.restrictions.forEach((restriction: string, index: number) => {
      if (typeof restriction !== 'string' || restriction.length > VALIDATION_LIMITS.WORKOUT.MAX_RESTRICTION_LENGTH) {
        errors.push(`Restriction ${index + 1} must be a string of maximum ${VALIDATION_LIMITS.WORKOUT.MAX_RESTRICTION_LENGTH} characters`);
      }
    });
  }

  if (errors.length > 0) {
    throw new GeminiServiceError(
      'Invalid workout plan request',
      'VALIDATION_ERROR',
      400,
      false,
      errors
    );
  }

  // Sanitize inputs
  return {
    ...request,
    preferences: sanitizeArray(request.preferences),
    restrictions: sanitizeArray(request.restrictions)
  };
};

export const validateActivityRecommendationRequest = (request: any) => {
  const errors: string[] = [];

  // Validate interests
  if (!Array.isArray(request.interests)) {
    errors.push('Interests must be an array');
  } else {
    if (request.interests.length < VALIDATION_LIMITS.ACTIVITY.MIN_INTERESTS) {
      errors.push(`At least ${VALIDATION_LIMITS.ACTIVITY.MIN_INTERESTS} interest is required`);
    }
    if (request.interests.length > VALIDATION_LIMITS.ACTIVITY.MAX_INTERESTS) {
      errors.push(`Maximum ${VALIDATION_LIMITS.ACTIVITY.MAX_INTERESTS} interests allowed`);
    }
    request.interests.forEach((interest: string, index: number) => {
      if (typeof interest !== 'string' || interest.length > VALIDATION_LIMITS.ACTIVITY.MAX_INTEREST_LENGTH) {
        errors.push(`Interest ${index + 1} must be a string of maximum ${VALIDATION_LIMITS.ACTIVITY.MAX_INTEREST_LENGTH} characters`);
      }
    });
  }

  // Validate location
  if (typeof request.location !== 'string' || request.location.length > VALIDATION_LIMITS.ACTIVITY.MAX_LOCATION_LENGTH) {
    errors.push(`Location must be a string of maximum ${VALIDATION_LIMITS.ACTIVITY.MAX_LOCATION_LENGTH} characters`);
  }

  // Validate available time
  if (!Number.isInteger(request.availableTime) || 
      request.availableTime < VALIDATION_LIMITS.ACTIVITY.MIN_TIME || 
      request.availableTime > VALIDATION_LIMITS.ACTIVITY.MAX_TIME) {
    errors.push(`Available time must be between ${VALIDATION_LIMITS.ACTIVITY.MIN_TIME} and ${VALIDATION_LIMITS.ACTIVITY.MAX_TIME} minutes`);
  }

  // Validate current activities
  if (!Array.isArray(request.currentActivities)) {
    errors.push('Current activities must be an array');
  } else {
    if (request.currentActivities.length > VALIDATION_LIMITS.ACTIVITY.MAX_CURRENT_ACTIVITIES) {
      errors.push(`Maximum ${VALIDATION_LIMITS.ACTIVITY.MAX_CURRENT_ACTIVITIES} current activities allowed`);
    }
    request.currentActivities.forEach((activity: string, index: number) => {
      if (typeof activity !== 'string' || activity.length > VALIDATION_LIMITS.ACTIVITY.MAX_ACTIVITY_LENGTH) {
        errors.push(`Activity ${index + 1} must be a string of maximum ${VALIDATION_LIMITS.ACTIVITY.MAX_ACTIVITY_LENGTH} characters`);
      }
    });
  }

  if (errors.length > 0) {
    throw new GeminiServiceError(
      'Invalid activity recommendation request',
      'VALIDATION_ERROR',
      400,
      false,
      errors
    );
  }

  // Sanitize inputs
  return {
    ...request,
    interests: sanitizeArray(request.interests),
    location: sanitizeString(request.location),
    currentActivities: sanitizeArray(request.currentActivities)
  };
};

export const validateMealPlanRequest = (request: any) => {
  const errors: string[] = [];

  // Validate dietary restrictions
  if (!Array.isArray(request.dietaryRestrictions)) {
    errors.push('Dietary restrictions must be an array');
  } else {
    if (request.dietaryRestrictions.length > VALIDATION_LIMITS.MEAL.MAX_RESTRICTIONS) {
      errors.push(`Maximum ${VALIDATION_LIMITS.MEAL.MAX_RESTRICTIONS} dietary restrictions allowed`);
    }
    request.dietaryRestrictions.forEach((restriction: string, index: number) => {
      if (typeof restriction !== 'string' || restriction.length > VALIDATION_LIMITS.MEAL.MAX_RESTRICTION_LENGTH) {
        errors.push(`Restriction ${index + 1} must be a string of maximum ${VALIDATION_LIMITS.MEAL.MAX_RESTRICTION_LENGTH} characters`);
      }
    });
  }

  // Validate calorie goal
  if (!Number.isInteger(request.calorieGoal) || 
      request.calorieGoal < VALIDATION_LIMITS.MEAL.MIN_CALORIES || 
      request.calorieGoal > VALIDATION_LIMITS.MEAL.MAX_CALORIES) {
    errors.push(`Calorie goal must be between ${VALIDATION_LIMITS.MEAL.MIN_CALORIES} and ${VALIDATION_LIMITS.MEAL.MAX_CALORIES}`);
  }

  // Validate cuisine preferences
  if (!Array.isArray(request.cuisine)) {
    errors.push('Cuisine preferences must be an array');
  } else {
    if (request.cuisine.length < VALIDATION_LIMITS.MEAL.MIN_CUISINES) {
      errors.push(`At least ${VALIDATION_LIMITS.MEAL.MIN_CUISINES} cuisine preference is required`);
    }
    if (request.cuisine.length > VALIDATION_LIMITS.MEAL.MAX_CUISINES) {
      errors.push(`Maximum ${VALIDATION_LIMITS.MEAL.MAX_CUISINES} cuisine preferences allowed`);
    }
    request.cuisine.forEach((cuisine: string, index: number) => {
      if (typeof cuisine !== 'string' || cuisine.length > VALIDATION_LIMITS.MEAL.MAX_CUISINE_LENGTH) {
        errors.push(`Cuisine ${index + 1} must be a string of maximum ${VALIDATION_LIMITS.MEAL.MAX_CUISINE_LENGTH} characters`);
      }
    });
  }

  // Validate allergies
  if (!Array.isArray(request.allergies)) {
    errors.push('Allergies must be an array');
  } else {
    if (request.allergies.length > VALIDATION_LIMITS.MEAL.MAX_ALLERGIES) {
      errors.push(`Maximum ${VALIDATION_LIMITS.MEAL.MAX_ALLERGIES} allergies allowed`);
    }
    request.allergies.forEach((allergy: string, index: number) => {
      if (typeof allergy !== 'string' || allergy.length > VALIDATION_LIMITS.MEAL.MAX_ALLERGY_LENGTH) {
        errors.push(`Allergy ${index + 1} must be a string of maximum ${VALIDATION_LIMITS.MEAL.MAX_ALLERGY_LENGTH} characters`);
      }
    });
  }

  if (errors.length > 0) {
    throw new GeminiServiceError(
      'Invalid meal plan request',
      'VALIDATION_ERROR',
      400,
      false,
      errors
    );
  }

  // Sanitize inputs
  return {
    ...request,
    dietaryRestrictions: sanitizeArray(request.dietaryRestrictions),
    cuisine: sanitizeArray(request.cuisine),
    allergies: sanitizeArray(request.allergies)
  };
};

export const validateEcoScoreRequest = (request: any) => {
  const errors: string[] = [];

  // Validate activities
  if (!Array.isArray(request.activities)) {
    errors.push('Activities must be an array');
  } else {
    if (request.activities.length < VALIDATION_LIMITS.ECO_SCORE.MIN_ACTIVITIES) {
      errors.push(`At least ${VALIDATION_LIMITS.ECO_SCORE.MIN_ACTIVITIES} activity is required`);
    }
    if (request.activities.length > VALIDATION_LIMITS.ECO_SCORE.MAX_ACTIVITIES) {
      errors.push(`Maximum ${VALIDATION_LIMITS.ECO_SCORE.MAX_ACTIVITIES} activities allowed`);
    }
    request.activities.forEach((activity: any, index: number) => {
      if (typeof activity.type !== 'string') {
        errors.push(`Activity ${index + 1} type must be a string`);
      }
      if (!Number.isInteger(activity.frequency) || activity.frequency < 0) {
        errors.push(`Activity ${index + 1} frequency must be a positive integer`);
      }
      if (typeof activity.impact !== 'number' || activity.impact < 0 || activity.impact > 100) {
        errors.push(`Activity ${index + 1} impact must be a number between 0 and 100`);
      }
    });
  }

  // Validate habits
  if (!Array.isArray(request.habits)) {
    errors.push('Habits must be an array');
  } else {
    if (request.habits.length < VALIDATION_LIMITS.ECO_SCORE.MIN_HABITS) {
      errors.push(`At least ${VALIDATION_LIMITS.ECO_SCORE.MIN_HABITS} habit is required`);
    }
    if (request.habits.length > VALIDATION_LIMITS.ECO_SCORE.MAX_HABITS) {
      errors.push(`Maximum ${VALIDATION_LIMITS.ECO_SCORE.MAX_HABITS} habits allowed`);
    }
    request.habits.forEach((habit: any, index: number) => {
      if (typeof habit.name !== 'string') {
        errors.push(`Habit ${index + 1} name must be a string`);
      }
      if (typeof habit.frequency !== 'string') {
        errors.push(`Habit ${index + 1} frequency must be a string`);
      }
      if (typeof habit.impact !== 'number' || habit.impact < 0 || habit.impact > 100) {
        errors.push(`Habit ${index + 1} impact must be a number between 0 and 100`);
      }
    });
  }

  // Validate consumption
  if (!Array.isArray(request.consumption)) {
    errors.push('Consumption must be an array');
  } else {
    if (request.consumption.length < VALIDATION_LIMITS.ECO_SCORE.MIN_CONSUMPTION) {
      errors.push(`At least ${VALIDATION_LIMITS.ECO_SCORE.MIN_CONSUMPTION} consumption item is required`);
    }
    if (request.consumption.length > VALIDATION_LIMITS.ECO_SCORE.MAX_CONSUMPTION) {
      errors.push(`Maximum ${VALIDATION_LIMITS.ECO_SCORE.MAX_CONSUMPTION} consumption items allowed`);
    }
    request.consumption.forEach((item: any, index: number) => {
      if (typeof item.category !== 'string') {
        errors.push(`Consumption item ${index + 1} category must be a string`);
      }
      if (typeof item.amount !== 'number' || item.amount < 0) {
        errors.push(`Consumption item ${index + 1} amount must be a positive number`);
      }
      if (typeof item.unit !== 'string') {
        errors.push(`Consumption item ${index + 1} unit must be a string`);
      }
    });
  }

  if (errors.length > 0) {
    throw new GeminiServiceError(
      'Invalid eco-score request',
      'VALIDATION_ERROR',
      400,
      false,
      errors
    );
  }

  // Sanitize inputs
  return {
    activities: request.activities.map((activity: any) => ({
      ...activity,
      type: sanitizeString(activity.type)
    })),
    habits: request.habits.map((habit: any) => ({
      ...habit,
      name: sanitizeString(habit.name),
      frequency: sanitizeString(habit.frequency)
    })),
    consumption: request.consumption.map((item: any) => ({
      ...item,
      category: sanitizeString(item.category),
      unit: sanitizeString(item.unit)
    }))
  };
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 