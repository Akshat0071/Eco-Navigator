
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import SustainabilityStats from '@/components/SustainabilityStats';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  useEffect(() => {
    document.title = 'Sustainify - Track Your Health, Save the Planet';
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <SustainabilityStats />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
