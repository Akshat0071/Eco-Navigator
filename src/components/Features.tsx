
import React from 'react';
import FeatureCard from './FeatureCard';
import { Activity, Bike, LineChart, Leaf, Droplet, Trophy, Users, BookOpen } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -rotate-180 w-64 h-64 bg-eco-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-ocean-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="font-display font-bold mb-4">
            Transform Your <span className="heading-gradient">Lifestyle</span> with Smart Tracking
          </h2>
          <p className="text-lg text-muted-foreground">
            Track your habits, measure your impact, and receive personalized recommendations to 
            live healthier while reducing your environmental footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Leaf}
            title="Eco-Friendly Habits"
            description="Track daily sustainable actions like recycling, water usage, and transportation choices to measure your environmental impact."
            iconBg="bg-eco-100"
            iconColor="text-eco-600"
          />
          
          <FeatureCard 
            icon={Activity}
            title="Health Monitoring"
            description="Monitor your exercise, nutrition, water intake, and sleep patterns to maintain a balanced and healthy lifestyle."
            iconBg="bg-ocean-100"
            iconColor="text-ocean-600"
          />
          
          <FeatureCard 
            icon={LineChart}
            title="Progress Analytics"
            description="View detailed charts and insights about your health metrics and sustainability efforts over time."
            iconBg="bg-earth-100"
            iconColor="text-earth-600"
          />
          
          <FeatureCard 
            icon={Droplet}
            title="Personalized Plans"
            description="Receive AI-generated meal plans and workout routines tailored to your dietary preferences and fitness goals."
            iconBg="bg-ocean-100"
            iconColor="text-ocean-600"
          />
          
          <FeatureCard 
            icon={Bike}
            title="AI Recommendations"
            description="Get smart suggestions for more sustainable lifestyle choices based on your habits and local environment."
            iconBg="bg-eco-100"
            iconColor="text-eco-600"
          />
          
          <FeatureCard 
            icon={Trophy}
            title="Achievements & Rewards"
            description="Earn badges, complete challenges, and collect rewards for reaching sustainability and health milestones."
            iconBg="bg-earth-100"
            iconColor="text-earth-600"
          />
          
          <FeatureCard 
            icon={Users}
            title="Community Challenges"
            description="Join group challenges and compare eco-scores with friends to stay motivated and make a bigger impact together."
            iconBg="bg-eco-100"
            iconColor="text-eco-600"
          />
          
          <FeatureCard 
            icon={BookOpen}
            title="Educational Resources"
            description="Access a library of articles, videos, and guides about sustainable living, nutrition, and fitness."
            iconBg="bg-ocean-100"
            iconColor="text-ocean-600"
          />
          
          <FeatureCard 
            icon={Activity}
            title="Real-time Feedback"
            description="Get immediate feedback on your daily choices and learn how small changes can lead to significant improvements."
            iconBg="bg-earth-100"
            iconColor="text-earth-600"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
