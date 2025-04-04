export interface MealPlan {
  name: string;
  calories: number;
  ecoScore: number;
  ingredients: string[];
  instructions: string[];
  carbonFootprint: number;
}

export interface Workout {
  name: string;
  duration: string;
  difficulty: string;
  calories: number;
  targetMuscles: string[];
  steps: string[];
  videoUrl?: string;
}

export interface ActivityLog {
  type: string;
  value: number;
  unit: string;
  ecoImpact: number;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  dietaryPreferences: string[];
  fitnessGoals: string[];
  ecoGoals: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EcoStats {
  totalCO2Saved: number;
  waterSaved: number;
  energySaved: number;
  treesEquivalent: number;
  streak: number;
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  progress: number;
  target: number;
} 