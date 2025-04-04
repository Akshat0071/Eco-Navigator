import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Leaf, Droplet, Bolt, Car, Bus, Bike, Footprints } from 'lucide-react';

interface ActivityLog {
  type: string;
  value: number;
  unit: string;
  ecoImpact: number;
  timestamp: Date;
}

const ActivityTracker: React.FC = () => {
  const [activityType, setActivityType] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const addActivity = () => {
    if (!activityType || !value) return;

    const newLog: ActivityLog = {
      type: activityType,
      value: parseFloat(value),
      unit: getUnitForActivity(activityType),
      ecoImpact: calculateEcoImpact(activityType, parseFloat(value)),
      timestamp: new Date()
    };

    setLogs([newLog, ...logs]);
    setActivityType('');
    setValue('');
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
    // This would be connected to a more sophisticated calculation in production
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
        <h2 className="text-2xl font-bold">Daily Activity Tracker</h2>
        <p className="text-muted-foreground">Log your daily activities and track your eco-impact.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Type</label>
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
            <label className="text-sm font-medium">Value</label>
            <Input
              type="number"
              placeholder={`Enter value in ${getUnitForActivity(activityType)}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={addActivity} className="w-full">
          Log Activity
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Activities</h3>
        {logs.map((log, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getActivityIcon(log.type)}
                <div>
                  <p className="font-medium capitalize">{log.type}</p>
                  <p className="text-sm text-muted-foreground">
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
            <p className="text-xs text-muted-foreground mt-2">
              {log.timestamp.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityTracker; 