import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface WellnessStats {
  steps: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  calories: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  water: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  sleep: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  mood: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}

const Analytics = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("steps");
  const [timeRange, setTimeRange] = useState("daily");
  const [stats, setStats] = useState<WellnessStats>({
    steps: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    calories: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    water: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    sleep: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    mood: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's wellness statistics from the backend
    const fetchStats = async () => {
      try {
        // Simulated data for now
        setStats({
          steps: {
            daily: [6000, 7500, 8000, 7000, 9000, 8500, 7500],
            weekly: [40000, 45000, 50000, 55000],
            monthly: [180000, 200000, 220000],
          },
          calories: {
            daily: [1800, 2100, 1900, 2200, 2000, 2300, 2100],
            weekly: [14000, 15000, 16000, 17000],
            monthly: [60000, 65000, 70000],
          },
          water: {
            daily: [4, 5, 6, 5, 7, 6, 5],
            weekly: [35, 38, 40, 42],
            monthly: [150, 160, 170],
          },
          sleep: {
            daily: [7, 7.5, 8, 7, 8.5, 7.5, 8],
            weekly: [50, 52, 54, 56],
            monthly: [220, 230, 240],
          },
          mood: {
            daily: [4, 5, 4, 5, 4, 5, 4],
            weekly: [30, 32, 34, 36],
            monthly: [130, 140, 150],
          },
        });
      } catch (error) {
        console.error("Error fetching wellness stats:", error);
        toast.error("Failed to load wellness statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-600"></div>
      </div>
    );
  }

  const renderChart = (data: number[]) => {
    // TODO: Implement actual chart visualization
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Chart visualization coming soon
        </p>
      </div>
    );
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "steps":
        return "Steps";
      case "calories":
        return "Calories Burned";
      case "water":
        return "Water Intake (L)";
      case "sleep":
        return "Sleep (hours)";
      case "mood":
        return "Mood (1-5)";
      default:
        return metric;
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Wellness Analytics
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Track your wellness journey over time
            </p>
          </div>

          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              {Object.keys(stats).map((metric) => (
                <TabsTrigger
                  key={metric}
                  value={metric}
                  onClick={() => setActiveTab(metric)}
                >
                  {getMetricLabel(metric)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="daily"
                onClick={() => setTimeRange("daily")}
              >
                Daily
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                onClick={() => setTimeRange("weekly")}
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                onClick={() => setTimeRange("monthly")}
              >
                Monthly
              </TabsTrigger>
            </TabsList>
          </div>

          <Card className="p-6">
            {renderChart(stats[activeTab as keyof WellnessStats][timeRange as keyof typeof stats.steps])}
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Average
              </h3>
              <p className="text-3xl font-bold text-eco-600 dark:text-eco-400">
                {Math.round(
                  stats[activeTab as keyof WellnessStats][
                    timeRange as keyof typeof stats.steps
                  ].reduce((a, b) => a + b, 0) /
                    stats[activeTab as keyof WellnessStats][
                      timeRange as keyof typeof stats.steps
                    ].length
                )}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Maximum
              </h3>
              <p className="text-3xl font-bold text-eco-600 dark:text-eco-400">
                {Math.max(
                  ...stats[activeTab as keyof WellnessStats][
                    timeRange as keyof typeof stats.steps
                  ]
                )}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Minimum
              </h3>
              <p className="text-3xl font-bold text-eco-600 dark:text-eco-400">
                {Math.min(
                  ...stats[activeTab as keyof WellnessStats][
                    timeRange as keyof typeof stats.steps
                  ]
                )}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 