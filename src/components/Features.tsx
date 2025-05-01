import React from 'react';
import FeatureCard from './FeatureCard';
import { Activity, Bike, LineChart, Leaf, Droplet, Trophy, Users, BookOpen, Calendar, Target } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-background">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -rotate-180 w-64 h-64 bg-eco-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-ocean-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="font-display font-bold mb-4">
            Features that <span className="heading-gradient">Empower</span> Your Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover tools and features designed to help you track, improve, and maintain your health and environmental impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-eco-100 dark:bg-eco-900/20 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-eco-600 dark:text-eco-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Eco-Friendly Habits</h3>
            <p className="text-muted-foreground">
              Track and develop sustainable habits that benefit both your health and the environment.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-ocean-100 dark:bg-ocean-900/20 flex items-center justify-center mb-4">
              <Droplet className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Health Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your physical activity, nutrition, and overall wellness in one place.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-earth-100 dark:bg-earth-900/20 flex items-center justify-center mb-4">
              <LineChart className="w-6 h-6 text-earth-600 dark:text-earth-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Progress Insights</h3>
            <p className="text-muted-foreground">
              Get detailed analytics and insights about your health and environmental impact.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-eco-100 dark:bg-eco-900/20 flex items-center justify-center mb-4">
              <Bike className="w-6 h-6 text-eco-600 dark:text-eco-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">AI Recommendations</h3>
            <p className="text-muted-foreground">
              Receive personalized suggestions based on your habits and goals.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-ocean-100 dark:bg-ocean-900/20 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Challenge System</h3>
            <p className="text-muted-foreground">
              Participate in community challenges to stay motivated and make a difference.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-earth-100 dark:bg-earth-900/20 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-earth-600 dark:text-earth-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Goal Setting</h3>
            <p className="text-muted-foreground">
              Set and track personal goals for health and sustainability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
