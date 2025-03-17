
import React from 'react';
import { Button } from '@/components/ui/button';
import CountUp from './animations/CountUp';
import { ArrowRight, TreePine, Droplet, Recycle, Leaf } from 'lucide-react';

const SustainabilityStats: React.FC = () => {
  return (
    <section id="stats" className="py-20 relative overflow-hidden bg-eco-50">
      {/* Background wave pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 580L48 566.7C96 553.3 192 526.7 288 513.3C384 500 480 500 576 506.7C672 513.3 768 526.7 864 553.3C960 580 1056 620 1152 620C1248 620 1344 580 1392 560L1440 540V800H1392C1344 800 1248 800 1152 800C1056 800 960 800 864 800C768 800 672 800 576 800C480 800 384 800 288 800C192 800 96 800 48 800H0V580Z"
            fill="currentColor"
            className="text-eco-700"
          />
          <path
            d="M0 610L48 620C96 630 192 650 288 643.3C384 636.7 480 603.3 576 596.7C672 590 768 610 864 620C960 630 1056 630 1152 630C1248 630 1344 630 1392 630L1440 630V800H1392C1344 800 1248 800 1152 800C1056 800 960 800 864 800C768 800 672 800 576 800C480 800 384 800 288 800C192 800 96 800 48 800H0V610Z"
            fill="currentColor"
            className="text-eco-600"
          />
          <path
            d="M0 680L48 673.3C96 666.7 192 653.3 288 663.3C384 673.3 480 706.7 576 716.7C672 726.7 768 713.3 864 700C960 686.7 1056 673.3 1152 680C1248 686.7 1344 713.3 1392 726.7L1440 740V800H1392C1344 800 1248 800 1152 800C1056 800 960 800 864 800C768 800 672 800 576 800C480 800 384 800 288 800C192 800 96 800 48 800H0V680Z"
            fill="currentColor"
            className="text-eco-500"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="font-display font-bold mb-4">
            Our <span className="heading-gradient">Global Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Together, our community is making a measurable difference. See how small daily 
            habits add up to create significant environmental change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="glass-card p-8 text-center animate-scale-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-eco-100 flex items-center justify-center">
              <TreePine className="w-8 h-8 text-eco-600" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <CountUp end={12567} suffix="+" className="text-eco-600" />
            </h3>
            <p className="text-muted-foreground">Trees Planted</p>
          </div>
          
          <div className="glass-card p-8 text-center animate-scale-up animation-delay-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ocean-100 flex items-center justify-center">
              <Droplet className="w-8 h-8 text-ocean-600" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <CountUp end={4582} suffix="K" className="text-ocean-600" />
            </h3>
            <p className="text-muted-foreground">Liters of Water Saved</p>
          </div>
          
          <div className="glass-card p-8 text-center animate-scale-up animation-delay-600">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-earth-100 flex items-center justify-center">
              <Recycle className="w-8 h-8 text-earth-600" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <CountUp end={98752} suffix="kg" className="text-earth-600" />
            </h3>
            <p className="text-muted-foreground">Waste Recycled</p>
          </div>
          
          <div className="glass-card p-8 text-center animate-scale-up animation-delay-900">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-eco-100 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-eco-600" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <CountUp end={237891} className="text-eco-600" />
            </h3>
            <p className="text-muted-foreground">CO₂ Emissions Reduced (kg)</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden rounded-3xl animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Join Our Growing Community of Eco-Warriors
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who are making a difference every day. Sign up now to start tracking 
                your impact and see how your small actions contribute to global change.
              </p>
              <Button className="bg-eco-500 hover:bg-eco-600 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 w-full sm:w-auto flex items-center justify-center space-x-2">
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="h-full min-h-[300px] bg-gradient-to-br from-eco-400 to-eco-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592834897009-56b748671a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-eco-500/10 to-eco-600/80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <h4 className="text-xl font-semibold mb-2">Eco Challenge of the Week</h4>
                <p className="text-white/80">Reduce single-use plastics for 7 days and earn extra points!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityStats;
