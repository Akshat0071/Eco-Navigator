import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import SustainabilityStats from '@/components/SustainabilityStats';
import Testimonials from '@/components/Testimonials';

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Eco-Navigator - Track Your Health, Save the Planet';
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Features />
        <SustainabilityStats />
        <Testimonials />
      </main>
    </div>
  );
};

export default Home; 