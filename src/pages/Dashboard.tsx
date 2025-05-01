import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, Activity, Droplet, LineChart, Calendar, Target, Award } from 'lucide-react';
import MealPlanGenerator from '@/components/ai/MealPlanGenerator';
import WorkoutRecommendations from '@/components/WorkoutRecommendations';
import ActivityTracker from '@/components/ActivityTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface WellnessData {
  steps: number;
  calories: number;
  water: number;
  sleep: number;
  mood: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [wellnessData, setWellnessData] = useState<WellnessData>({
    steps: 0,
    calories: 0,
    water: 0,
    sleep: 0,
    mood: 0,
  });

  const [ecoScore, setEcoScore] = useState(0);
  const [activityLevel, setActivityLevel] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Message */}
          <div className="glass-card p-6 rounded-xl">
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              Hi {user?.name || 'User'}, Welcome to your Personal Dashboard!
            </h1>
            <p className="text-muted-foreground">
              Track your health and environmental impact in one place.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Eco Score</h3>
                <Leaf className="h-5 w-5 text-eco-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{ecoScore}</div>
              <p className="text-sm text-muted-foreground">Your environmental impact score</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Activity Level</h3>
                <Activity className="h-5 w-5 text-eco-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{activityLevel}</div>
              <p className="text-sm text-muted-foreground">Your daily activity score</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Water Saved</h3>
                <Droplet className="h-5 w-5 text-eco-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">0 L</div>
              <p className="text-sm text-muted-foreground">Water saved this week</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Carbon Reduced</h3>
                <LineChart className="h-5 w-5 text-eco-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">0 kg</div>
              <p className="text-sm text-muted-foreground">CO₂ reduced this week</p>
            </div>
          </div>

          {/* Rest of the dashboard content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-background">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="glass-card p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Recommendations</h2>
                    <div className="space-y-4">
                      <div className="bg-eco-50 dark:bg-eco-900/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Leaf className="h-5 w-5 text-eco-600 dark:text-eco-400 mr-2" />
                          <h5 className="font-medium text-foreground">Try Plant-Based Meal</h5>
                        </div>
                        <p className="text-sm text-muted-foreground">Replace one meat meal with a plant-based alternative to reduce your carbon footprint.</p>
                        <Button variant="link" className="text-eco-600 dark:text-eco-400 hover:text-eco-500 p-0 h-auto mt-1">
                          Learn more
                        </Button>
                      </div>
                      
                      <div className="bg-ocean-50 dark:bg-ocean-900/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Droplet className="h-5 w-5 text-ocean-600 dark:text-ocean-400 mr-2" />
                          <h5 className="font-medium text-foreground">Save Water</h5>
                        </div>
                        <p className="text-sm text-muted-foreground">Take shorter showers to conserve water. A 2-minute reduction saves up to 15 liters.</p>
                        <Button variant="link" className="text-ocean-600 dark:text-ocean-400 hover:text-ocean-500 p-0 h-auto mt-1">
                          Learn more
                        </Button>
                      </div>
                      
                      <div className="bg-earth-50 dark:bg-earth-900/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <LineChart className="h-5 w-5 text-earth-600 dark:text-earth-400 mr-2" />
                          <h5 className="font-medium text-foreground">Track Energy Usage</h5>
                        </div>
                        <p className="text-sm text-muted-foreground">Monitor your home energy consumption by recording readings weekly.</p>
                        <Button variant="link" className="text-earth-600 dark:text-earth-400 hover:text-earth-500 p-0 h-auto mt-1">
                          Learn more
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="meal-plan">
              <MealPlanGenerator />
            </TabsContent>

            <TabsContent value="workout">
              <WorkoutRecommendations />
            </TabsContent>

            <TabsContent value="activities">
              <ActivityTracker />
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button className="w-full md:w-auto">
              View Detailed Analytics
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
