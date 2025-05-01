import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Leaf, Droplet, Bolt, Car, Bus, Bike, Footprints, Loader2 } from 'lucide-react';
import { geminiService, ActivityRecommendationRequest, ActivityRecommendationResponse } from '@/services/geminiService';
import { toast } from 'sonner';

interface ActivityLog {
  type: string;
  value: number;
  unit: string;
  ecoImpact: number;
  timestamp: Date;
  aiRecommendation?: string;
}

const ActivityTracker: React.FC = () => {
  const [activityType, setActivityType] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addActivity = async () => {
    if (!activityType || !value) return;
    setIsLoading(true);

    try {
      const newLog: ActivityLog = {
        type: activityType,
        value: parseFloat(value),
        unit: getUnitForActivity(activityType),
        ecoImpact: calculateEcoImpact(activityType, parseFloat(value)),
        timestamp: new Date()
      };

      // Get AI recommendation for the activity
      const recommendation = await getAIRecommendation(newLog);
      newLog.aiRecommendation = recommendation;

      setLogs([newLog, ...logs]);
      setActivityType('');
      setValue('');
      toast.success('Activity logged successfully!');
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error('Failed to log activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAIRecommendation = async (log: ActivityLog): Promise<string> => {
    try {
      const request: ActivityRecommendationRequest = {
        interests: [log.type],
        location: 'user-location', // This would be replaced with actual user location
        availableTime: 30,
        currentActivities: [log.type]
      };

      const result = await geminiService.generateActivityRecommendations(request);
      return result[0]?.description || 'No specific recommendation available.';
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      return 'Unable to generate recommendation at this time.';
    }
  };

  const getUnitForActivity = (type: string): string => {
    switch (type) {
      case 'energy':
        return 'kWh';
      case 'water':
        return 'L';
      case 'transport':
        return 'km';
      default:
        return '';
    }
  };

  const calculateEcoImpact = (type: string, value: number): number => {
    switch (type) {
      case 'energy':
        return value * 0.5; // kg CO2 per kWh
      case 'water':
        return value * 0.1; // kg CO2 per L
      case 'transport':
        return value * 0.2; // kg CO2 per km
      default:
        return 0;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'energy':
        return <Bolt className="h-5 w-5" />;
      case 'water':
        return <Droplet className="h-5 w-5" />;
      case 'transport':
        return <Car className="h-5 w-5" />;
      default:
        return <Leaf className="h-5 w-5" />;
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <Car className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'bike':
        return <Bike className="h-5 w-5" />;
      case 'walking':
        return <Footprints className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Daily Activity Tracker</h2>
        <p className="text-muted-foreground dark:text-gray-300">Log your daily activities and track your eco-impact with AI-powered recommendations.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Activity Type</label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="energy">Energy Usage</SelectItem>
                <SelectItem value="water">Water Usage</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Value</label>
            <Input
              type="number"
              placeholder={`Enter value in ${getUnitForActivity(activityType)}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-background/50 dark:bg-background/80 border-border"
            />
          </div>
        </div>
        
        <Button 
          onClick={addActivity} 
          className="w-full bg-eco-500 hover:bg-eco-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging Activity...
            </>
          ) : (
            "Log Activity"
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground dark:text-white">Recent Activities</h3>
        {logs.map((log, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getActivityIcon(log.type)}
                <div>
                  <p className="font-medium capitalize text-foreground dark:text-white">{log.type}</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    {log.value} {log.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-eco-600" />
                <span className="text-eco-600 font-medium">
                  {log.ecoImpact.toFixed(1)} kg CO2
                </span>
              </div>
            </div>
            {log.aiRecommendation && (
              <div className="mt-2 p-2 bg-eco-50 dark:bg-eco-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground dark:text-gray-300">
                  <span className="font-medium text-eco-600">AI Recommendation:</span> {log.aiRecommendation}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
              {log.timestamp.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityTracker; 