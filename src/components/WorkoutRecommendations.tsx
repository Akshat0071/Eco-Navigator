import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Activity, Timer, Target, Heart } from 'lucide-react';

interface Workout {
  name: string;
  duration: string;
  difficulty: string;
  calories: number;
  targetMuscles: string[];
  steps: string[];
  videoUrl?: string;
}

const WorkoutRecommendations: React.FC = () => {
  const [fitnessLevel, setFitnessLevel] = useState<string>('');
  const [workoutType, setWorkoutType] = useState<string>('');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const generateWorkout = () => {
    // This would be connected to an AI service in production
    const mockWorkout: Workout = {
      name: "Eco-Friendly HIIT Circuit",
      duration: "30 mins",
      difficulty: "Intermediate",
      calories: 350,
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
    setSelectedWorkout(mockWorkout);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">AI-Powered Workout Recommendations</h2>
        <p className="text-muted-foreground">Get personalized workout plans based on your fitness level and goals.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fitness Level</label>
            <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select fitness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Workout Type</label>
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger>
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="strength">Strength Training</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={generateWorkout} className="w-full">
          Generate Workout Plan
        </Button>
      </div>

      {selectedWorkout && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{selectedWorkout.name}</h3>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-eco-600" />
              <span className="text-eco-600 font-medium">{selectedWorkout.difficulty}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{selectedWorkout.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="font-medium">{selectedWorkout.calories}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Target Muscles</p>
                <p className="font-medium">{selectedWorkout.targetMuscles.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Workout Steps</h4>
              <ol className="list-decimal list-inside space-y-2">
                {selectedWorkout.steps.map((step, index) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ol>
            </div>

            {selectedWorkout.videoUrl && (
              <Button variant="outline" className="w-full">
                Watch Video Tutorial
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WorkoutRecommendations; 