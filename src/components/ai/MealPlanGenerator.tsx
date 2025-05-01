import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Utensils, Leaf, Loader2, Flame, Droplet } from 'lucide-react';
import { geminiService } from '@/services/geminiService';
import { toast } from 'sonner';

interface MealPlan {
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

const MealPlanGenerator: React.FC = () => {
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<string>('');
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateMealPlan = async () => {
    if (!calorieGoal) return;
    setIsLoading(true);

    try {
      console.log('Generating meal plan with API key length:', import.meta.env.VITE_GEMINI_API_KEY?.length);
      
      const result = await geminiService.generateMealPlan({
        dietaryRestrictions,
        calorieGoal: parseInt(calorieGoal),
        cuisine,
        allergies
      }, 'test-user'); // Adding a test user ID

      setMealPlan(result);
      toast.success('Meal plan generated successfully!');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      toast.error('Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">AI Meal Plan Generator</h2>
        <p className="text-muted-foreground dark:text-gray-300">Get personalized meal plans that align with your dietary preferences and eco-friendly goals.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Calorie Goal</label>
            <Input
              type="number"
              placeholder="Enter daily calorie goal"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              className="bg-background/50 dark:bg-background/80 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Dietary Restrictions</label>
            <Select
              onValueChange={(value) => setDietaryRestrictions([...dietaryRestrictions, value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dietary restrictions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                <SelectItem value="dairy-free">Dairy-Free</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Cuisine Preferences</label>
            <Select
              onValueChange={(value) => setCuisine([...cuisine, value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine preferences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Allergies</label>
            <Select
              onValueChange={(value) => setAllergies([...allergies, value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select allergies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuts">Nuts</SelectItem>
                <SelectItem value="shellfish">Shellfish</SelectItem>
                <SelectItem value="eggs">Eggs</SelectItem>
                <SelectItem value="soy">Soy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={generateMealPlan} 
          className="w-full bg-eco-500 hover:bg-eco-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Meal Plan...
            </>
          ) : (
            "Generate Meal Plan"
          )}
        </Button>
      </div>

      {mealPlan && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground dark:text-white">{mealPlan.name}</h3>
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-eco-600" />
              <span className="text-eco-600 font-medium">
                Eco-Score: {mealPlan.ecoScore}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground dark:text-gray-300">{mealPlan.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="font-medium text-foreground dark:text-white">{mealPlan.nutritionalInfo.calories}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="font-medium text-foreground dark:text-white">{mealPlan.nutritionalInfo.protein}g</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Droplet className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="font-medium text-foreground dark:text-white">{mealPlan.nutritionalInfo.carbs}g</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="font-medium text-foreground dark:text-white">{mealPlan.nutritionalInfo.fat}g</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground dark:text-white mb-2">Ingredients</h4>
              <ul className="list-disc list-inside space-y-1">
                {mealPlan.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-muted-foreground dark:text-gray-300">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground dark:text-white mb-2">Instructions</h4>
              <ol className="list-decimal list-inside space-y-1">
                {mealPlan.instructions.map((instruction, index) => (
                  <li key={index} className="text-muted-foreground dark:text-gray-300">{instruction}</li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-foreground dark:text-white mb-2">Environmental Impact</h4>
              <p className="text-muted-foreground dark:text-gray-300">
                Carbon Footprint: {mealPlan.carbonFootprint} kg CO2
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MealPlanGenerator; 