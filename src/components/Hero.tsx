
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bike, Droplet, Leaf, LineChart } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-eco-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-earth-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-ocean-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float animation-delay-1000"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col space-y-8 text-center lg:text-left animate-slide-up">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-eco-100 border border-eco-200 mb-4">
              <p className="text-eco-700 text-sm font-medium flex items-center">
                <Leaf className="w-4 h-4 mr-2" /> Sustainable Living Made Simple
              </p>
            </div>
            <h1 className="font-display font-bold mb-4">
              Track Your Health.
              <br className="hidden md:block" /> 
              <span className="heading-gradient">Save the Planet.</span>
              <br className="hidden md:block" /> 
              Live Sustainably.
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl md:max-w-md lg:max-w-lg mx-auto lg:mx-0">
              Your all-in-one platform for monitoring personal health, tracking eco-friendly habits, and making a positive impact on the planet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-eco-500 hover:bg-eco-600 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              Get Started
            </Button>
            <Button variant="outline" className="border-eco-500 text-eco-500 hover:bg-eco-500/10 rounded-full px-8 py-6 text-lg font-medium transition-all hover:-translate-y-1 duration-300">
              Track My Progress
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <Leaf className="text-eco-500 mb-2 w-6 h-6" />
              <p className="text-sm text-muted-foreground">Eco-Friendly Habits</p>
            </div>
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <Droplet className="text-ocean-500 mb-2 w-6 h-6" />
              <p className="text-sm text-muted-foreground">Health Tracking</p>
            </div>
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <LineChart className="text-earth-500 mb-2 w-6 h-6" />
              <p className="text-sm text-muted-foreground">Progress Insights</p>
            </div>
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <Bike className="text-eco-500 mb-2 w-6 h-6" />
              <p className="text-sm text-muted-foreground">AI Recommendations</p>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] animate-slide-in-right">
          <div className="absolute inset-0 bg-gradient-to-br from-eco-500/20 to-ocean-500/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Dashboard Preview */}
                <div className="w-[90%] h-[90%] bg-white/90 rounded-2xl shadow-lg overflow-hidden flex flex-col">
                  {/* Dashboard Header */}
                  <div className="bg-eco-500 text-white p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Eco Dashboard</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-white/30"></div>
                        <div className="w-3 h-3 rounded-full bg-white/30"></div>
                        <div className="w-3 h-3 rounded-full bg-white/30"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-medium">Today's Progress</h4>
                        <span className="text-eco-500 text-sm font-medium">85% Complete</span>
                      </div>
                      
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-eco-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 my-6">
                      <div className="bg-earth-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-earth-200 flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-earth-600" />
                          </div>
                          <h5 className="font-medium">Water Saved</h5>
                        </div>
                        <p className="text-xl font-bold">8.5 L</p>
                      </div>
                      
                      <div className="bg-ocean-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-ocean-200 flex items-center justify-center">
                            <Bike className="w-5 h-5 text-ocean-600" />
                          </div>
                          <h5 className="font-medium">CO₂ Reduced</h5>
                        </div>
                        <p className="text-xl font-bold">2.3 kg</p>
                      </div>
                    </div>
                    
                    <div className="bg-eco-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Leaf className="w-5 h-5 text-eco-600 mr-2" />
                        <h5 className="font-medium">Sustainability Tip</h5>
                      </div>
                      <p className="text-sm">Try using a reusable water bottle today to reduce plastic waste and earn 50 eco-points!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
