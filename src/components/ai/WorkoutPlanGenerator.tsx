import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Dumbbell, Timer, Flame, TrendingUp, Loader2, Leaf } from 'lucide-react';
import { geminiService, WorkoutPlanRequest, WorkoutPlanResponse } from '@/services/geminiService';
import { toast } from 'sonner';

interface Workout {
  name: string;
  duration: number;
  difficulty: string;
  caloriesBurned: number;
  steps: string[];
  ecoImpact: number;
  aiTips?: string[];
  timestamp: Date;
}

interface WorkoutLog {
  workout: Workout;
  completed: boolean;
  feedback?: string;
}

const WorkoutPlanGenerator: React.FC = () => {
  const [duration, setDuration] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState(true);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      setIsApiKeySet(!!apiKey);
    };
    checkApiKey();
  }, []);

  const generateWorkout = async () => {
    if (!isApiKeySet) {
      toast.error('Gemini API key is not set. Please check your environment variables.');
      return;
    }

    if (!duration || !difficulty) return;
    setIsLoading(true);

    try {
      const request: WorkoutPlanRequest = {
        duration: parseInt(duration),
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        preferences: [], // This would be populated with user preferences
        restrictions: [] // This would be populated with user restrictions
      };

      const result = await geminiService.generateWorkoutPlan(request);

      if (result && result.length > 0) {
        const generatedWorkout: Workout = {
          name: result[0].name,
          duration: parseInt(duration),
          difficulty,
          caloriesBurned: calculateCaloriesBurned(parseInt(duration), difficulty),
          steps: result[0].steps,
          ecoImpact: calculateEcoImpact(parseInt(duration)),
          aiTips: result[0].tips,
          timestamp: new Date()
        };
        setWorkout(generatedWorkout);
        toast.success('Workout plan generated successfully!');
      }
    } catch (error) {
      console.error('Error generating workout:', error);
      toast.error('Failed to generate workout plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logWorkout = () => {
    if (!workout) return;

    const newLog: WorkoutLog = {
      workout,
      completed: true,
      feedback: feedback
    };

    setWorkoutLogs([newLog, ...workoutLogs]);
    setWorkout(null);
    setFeedback('');
    toast.success('Workout logged successfully!');
  };

  const calculateCaloriesBurned = (duration: number, difficulty: string): number => {
    const baseCalories = duration * 5; // 5 calories per minute base
    switch (difficulty) {
      case 'beginner':
        return baseCalories;
      case 'intermediate':
        return baseCalories * 1.5;
      case 'advanced':
        return baseCalories * 2;
      default:
        return baseCalories;
    }
  };

  const calculateEcoImpact = (duration: number): number => {
    // Assuming each minute of exercise reduces carbon footprint by 0.1 kg
    return duration * 0.1;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">AI Workout Plan Generator</h2>
        <p className="text-muted-foreground dark:text-gray-300">Get personalized workout plans with eco-friendly tips and track your progress.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Duration (minutes)</label>
            <Input
              type="number"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-background/50 dark:bg-background/80 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Difficulty Level</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={generateWorkout} 
          className="w-full bg-eco-500 hover:bg-eco-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Workout...
            </>
          ) : (
            "Generate Workout"
          )}
        </Button>
      </div>

      {workout && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground dark:text-white">{workout.name}</h3>
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-5 w-5 text-eco-600" />
              <span className="text-eco-600 font-medium">
                {workout.ecoImpact.toFixed(1)} kg CO2 saved
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{workout.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground capitalize">{workout.difficulty}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{workout.caloriesBurned} calories</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground dark:text-white">Workout Steps</h4>
            <ol className="list-decimal list-inside space-y-1">
              {workout.steps.map((step, index) => (
                <li key={index} className="text-muted-foreground dark:text-gray-300">{step}</li>
              ))}
            </ol>
          </div>

          {workout.aiTips && workout.aiTips.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground dark:text-white">AI Tips</h4>
              <ul className="list-disc list-inside space-y-1">
                {workout.aiTips.map((tip, index) => (
                  <li key={index} className="text-muted-foreground dark:text-gray-300">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium text-foreground dark:text-white">Workout Feedback</h4>
            <Input
              placeholder="How was your workout? (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="bg-background/50 dark:bg-background/80 border-border"
            />
            <Button 
              onClick={logWorkout}
              className="w-full bg-eco-500 hover:bg-eco-600 text-white"
            >
              Complete Workout
            </Button>
          </div>
        </Card>
      )}

      {workoutLogs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground dark:text-white">Workout History</h3>
          {workoutLogs.map((log, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Dumbbell className="h-5 w-5 text-eco-600" />
                  <div>
                    <p className="font-medium text-foreground dark:text-white">{log.workout.name}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">
                      {log.workout.duration} min • {log.workout.difficulty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-eco-600" />
                  <span className="text-eco-600 font-medium">
                    {log.workout.ecoImpact.toFixed(1)} kg CO2 saved
                  </span>
                </div>
              </div>
              {log.feedback && (
                <div className="mt-2 p-2 bg-eco-50 dark:bg-eco-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    <span className="font-medium text-eco-600">Feedback:</span> {log.feedback}
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
                {log.workout.timestamp.toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanGenerator; 