import { MealPlan, Workout, ActivityLog } from '@/types';

// This would be replaced with actual API calls in production
export const aiService = {
  // Generate personalized meal plan
  generateMealPlan: async (dietType: string, calories: number): Promise<MealPlan> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would be replaced with actual AI model predictions
    return {
      name: "Sustainable Buddha Bowl",
      calories: calories,
      ecoScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
      ingredients: [
        "1 cup quinoa",
        "1 cup chickpeas",
        "2 cups mixed greens",
        "1 avocado",
        "1 cup cherry tomatoes",
        "1/2 cup cucumber",
        "2 tbsp olive oil",
        "1 lemon"
      ],
      instructions: [
        "Cook quinoa according to package instructions",
        "Rinse and drain chickpeas",
        "Chop vegetables",
        "Combine all ingredients in a bowl",
        "Dress with olive oil and lemon juice"
      ],
      carbonFootprint: 0.8 // kg CO2
    };
  },

  // Generate personalized workout plan
  generateWorkout: async (fitnessLevel: string, workoutType: string): Promise<Workout> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would be replaced with actual AI model predictions
    return {
      name: "Eco-Friendly HIIT Circuit",
      duration: "30 mins",
      difficulty: fitnessLevel,
      calories: Math.floor(Math.random() * 200) + 200, // Random calories between 200-400
      targetMuscles: ["Full Body", "Core", "Legs"],
      steps: [
        "Warm up with 5 minutes of light cardio",
        "Perform 30 seconds of mountain climbers",
        "Rest for 15 seconds",
        "Do 30 seconds of burpees",
        "Rest for 15 seconds",
        "Complete 30 seconds of plank to push-up",
        "Rest for 15 seconds",
        "Repeat circuit 3 times",
        "Cool down with 5 minutes of stretching"
      ],
      videoUrl: "https://example.com/workout-video"
    };
  },

  // Generate personalized recommendations based on activity logs
  generateRecommendations: async (activityLogs: ActivityLog[]): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would be replaced with actual AI model predictions
    return [
      "Try reducing your energy consumption during peak hours",
      "Consider using public transport or cycling for short distances",
      "Install water-saving fixtures to reduce water usage",
      "Start a small herb garden to reduce food miles",
      "Use natural light during daytime to save electricity"
    ];
  },

  // Calculate eco-impact score
  calculateEcoScore: async (activityLogs: ActivityLog[]): Promise<number> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would be replaced with actual AI model predictions
    const totalImpact = activityLogs.reduce((sum, log) => sum + log.ecoImpact, 0);
    const maxScore = 1000; // Maximum possible impact
    const score = Math.max(0, Math.min(100, 100 - (totalImpact / maxScore) * 100));
    return Math.round(score);
  }
}; 