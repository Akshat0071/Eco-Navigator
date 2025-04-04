import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Leaf, Utensils, Scale, Clock } from 'lucide-react';

interface MealPlan {
  name: string;
  calories: number;
  ecoScore: number;
  ingredients: string[];
  instructions: string[];
  carbonFootprint: number;
}

const MealPlanGenerator: React.FC = () => {
  const [dietType, setDietType] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const generateMealPlan = () => {
    // This would be connected to an AI service in production
    const mockMealPlan: MealPlan = {
      name: "Sustainable Buddha Bowl",
      calories: 450,
      ecoScore: 92,
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
    setMealPlan(mockMealPlan);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">AI-Powered Meal Plan Generator</h2>
        <p className="text-muted-foreground">Get personalized, sustainable meal recommendations based on your preferences.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Diet Type</label>
            <Select value={dietType} onValueChange={setDietType}>
              <SelectTrigger>
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Daily Calories</label>
            <Input
              type="number"
              placeholder="Enter target calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={generateMealPlan} className="w-full">
          Generate Meal Plan
        </Button>
      </div>

      {mealPlan && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{mealPlan.name}</h3>
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-eco-600" />
              <span className="text-eco-600 font-medium">Eco Score: {mealPlan.ecoScore}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="font-medium">{mealPlan.calories}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Scale className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Carbon Footprint</p>
                <p className="font-medium">{mealPlan.carbonFootprint} kg CO2</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prep Time</p>
                <p className="font-medium">20 mins</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Ingredients</h4>
              <ul className="list-disc list-inside space-y-1">
                {mealPlan.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <ol className="list-decimal list-inside space-y-1">
                {mealPlan.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm">{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MealPlanGenerator; 