import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { geminiService } from '@/services/geminiService';
import { toast } from 'sonner';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const EcoScoreAnalyzer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyzeEcoScore = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with actual user data in a real implementation
      const userData = {
        activities: [
          { type: 'cycling', frequency: 3, impact: 0.5 },
          { type: 'recycling', frequency: 7, impact: 0.3 },
          { type: 'public-transport', frequency: 5, impact: 0.4 },
        ],
        habits: [
          { name: 'water-conservation', frequency: 'daily', impact: 0.6 },
          { name: 'energy-saving', frequency: 'daily', impact: 0.7 },
          { name: 'waste-reduction', frequency: 'weekly', impact: 0.5 },
        ],
        consumption: [
          { category: 'food', amount: 2000, unit: 'calories' },
          { category: 'water', amount: 100, unit: 'liters' },
          { category: 'energy', amount: 50, unit: 'kWh' },
        ],
      };

      const result = await geminiService.calculateEcoScore(userData);
      setAnalysis(result);
      toast.success('Eco-score analysis completed!');
    } catch (error) {
      console.error('Error analyzing eco-score:', error);
      toast.error('Failed to analyze eco-score. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Eco-Score Analysis</h2>
        <p className="text-muted-foreground dark:text-gray-300">
          Get detailed insights into your environmental impact and personalized recommendations for improvement.
        </p>
        
        <Button
          onClick={handleAnalyzeEcoScore}
          className="w-full bg-eco-500 hover:bg-eco-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Eco-Score...
            </>
          ) : (
            "Analyze Eco-Score"
          )}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Overall Eco-Score</h3>
              <div className="text-3xl font-bold text-eco-600">{analysis.score}</div>
            </div>
            <p className="text-muted-foreground dark:text-gray-300">
              Your current eco-score based on your activities, habits, and consumption patterns.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {analysis.breakdown.map((category: any, index: number) => (
                <div key={index} className="bg-background/50 dark:bg-background/80 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{category.category}</h4>
                    <span className="text-eco-600 font-medium">Score: {category.score}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Suggestions:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {category.suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Trends</h3>
            <div className="space-y-4">
              {analysis.trends.map((trend: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background/50 dark:bg-background/80 rounded-lg">
                  <div>
                    <h4 className="font-medium">{trend.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {trend.trend === 'improving' ? 'Improving' : 
                       trend.trend === 'declining' ? 'Declining' : 'Stable'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(trend.trend)}
                    <span className="font-medium">{trend.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-eco-600 mt-2"></div>
                  <p className="text-muted-foreground dark:text-gray-300">{recommendation}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EcoScoreAnalyzer; 