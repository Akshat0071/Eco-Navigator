import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaf, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { geminiService } from '@/services/geminiService';
import { toast } from 'sonner';

interface EcoScoreAnalysis {
  score: number;
  breakdown: {
    category: string;
    score: number;
    suggestions: string[];
  }[];
  recommendations: string[];
  trends: {
    category: string;
    trend: 'improving' | 'declining' | 'stable';
    percentage: number;
  }[];
}

const EcoScoreAnalyst: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EcoScoreAnalysis | null>(null);

  const analyzeEcoScore = async () => {
    setIsLoading(true);

    try {
      const userData = {
        activities: [
          { type: 'transport', frequency: 5, impact: 2.5 },
          { type: 'energy', frequency: 7, impact: 3.5 },
          { type: 'water', frequency: 3, impact: 1.5 }
        ],
        habits: [
          { name: 'recycling', frequency: 'daily', impact: 2 },
          { name: 'composting', frequency: 'weekly', impact: 1.5 }
        ],
        consumption: [
          { category: 'food', amount: 5, unit: 'kg' },
          { category: 'water', amount: 100, unit: 'L' }
        ]
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
        return <Leaf className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Eco-Score Analysis</h2>
        <p className="text-muted-foreground dark:text-gray-300">Get insights into your environmental impact and receive personalized recommendations.</p>
        
        <Button 
          onClick={analyzeEcoScore} 
          className="w-full bg-eco-500 hover:bg-eco-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Eco-Score"
          )}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground dark:text-white">Overall Eco-Score</h3>
              <div className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-eco-600" />
                <span className="text-2xl font-bold text-eco-600">{analysis.score}</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h4 className="font-medium text-foreground dark:text-white mb-4">Category Breakdown</h4>
              <div className="space-y-4">
                {analysis.breakdown.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground dark:text-gray-300">{category.category}</span>
                      <span className="font-medium text-foreground dark:text-white">{category.score}</span>
                    </div>
                    <div className="space-y-1">
                      {category.suggestions.map((suggestion, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground dark:text-gray-300">• {suggestion}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-medium text-foreground dark:text-white mb-4">Trends</h4>
              <div className="space-y-4">
                {analysis.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-muted-foreground dark:text-gray-300">{trend.category}</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(trend.trend)}
                      <span className="font-medium text-foreground dark:text-white">
                        {trend.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h4 className="font-medium text-foreground dark:text-white mb-4">Recommendations</h4>
            <ul className="list-disc list-inside space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-muted-foreground dark:text-gray-300">{recommendation}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EcoScoreAnalyst; 