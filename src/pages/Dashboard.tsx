
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Leaf, Activity, Droplet, LineChart, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  // This is a placeholder dashboard for now
  // In a real app, this would display actual user data
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">Track your progress, monitor your habits, and see your impact</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-eco-100 mr-4">
                  <Leaf className="h-6 w-6 text-eco-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eco Score</p>
                  <h3 className="text-2xl font-semibold">785</h3>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-eco-500 h-2 rounded-full" style={{ width: '78.5%' }}></div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-ocean-100 mr-4">
                  <Activity className="h-6 w-6 text-ocean-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Activity Level</p>
                  <h3 className="text-2xl font-semibold">Good</h3>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-ocean-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-earth-100 mr-4">
                  <Droplet className="h-6 w-6 text-earth-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Water Saved</p>
                  <h3 className="text-2xl font-semibold">12.5 L</h3>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-earth-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-eco-100 mr-4">
                  <Calendar className="h-6 w-6 text-eco-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <h3 className="text-2xl font-semibold">8 days</h3>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-eco-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Activity Feed & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start pb-4 border-b last:border-0">
                      <div className="p-2 rounded-lg bg-eco-100 mr-4">
                        <Leaf className="h-5 w-5 text-eco-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Completed Eco Challenge #{item}</h4>
                        <p className="text-sm text-muted-foreground">You saved 2.3kg of CO₂ by using public transport</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-eco-500 text-eco-500 hover:bg-eco-500/10">
                  View All Activity
                </Button>
              </div>
            </div>
            
            <div>
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                <div className="space-y-4">
                  <div className="bg-eco-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Leaf className="h-5 w-5 text-eco-600 mr-2" />
                      <h5 className="font-medium">Try Plant-Based Meal</h5>
                    </div>
                    <p className="text-sm">Replace one meat meal with a plant-based alternative to reduce your carbon footprint.</p>
                    <Button variant="link" className="text-eco-600 hover:text-eco-500 p-0 h-auto mt-1">
                      Learn more
                    </Button>
                  </div>
                  
                  <div className="bg-ocean-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Droplet className="h-5 w-5 text-ocean-600 mr-2" />
                      <h5 className="font-medium">Save Water</h5>
                    </div>
                    <p className="text-sm">Take shorter showers to conserve water. A 2-minute reduction saves up to 15 liters.</p>
                    <Button variant="link" className="text-ocean-600 hover:text-ocean-500 p-0 h-auto mt-1">
                      Learn more
                    </Button>
                  </div>
                  
                  <div className="bg-earth-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <LineChart className="h-5 w-5 text-earth-600 mr-2" />
                      <h5 className="font-medium">Track Energy Usage</h5>
                    </div>
                    <p className="text-sm">Monitor your home energy consumption by recording readings weekly.</p>
                    <Button variant="link" className="text-earth-600 hover:text-earth-500 p-0 h-auto mt-1">
                      Learn more
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
