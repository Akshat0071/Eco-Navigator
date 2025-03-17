
import React from 'react';
import TestimonialCard from './TestimonialCard';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-earth-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-ocean-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="font-display font-bold mb-4">
            Success <span className="heading-gradient">Stories</span> from Our Community
          </h2>
          <p className="text-lg text-muted-foreground">
            See how Sustainify has helped people transform their health and environmental impact 
            through simple daily habits and smart tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard 
            name="Emma Johnson"
            role="Fitness Enthusiast"
            content="The AI recommendations have completely transformed my workout routine. I've lost 15 pounds and feel more energetic than ever, all while reducing my carbon footprint!"
            rating={5}
            imageSrc="https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
          />
          
          <TestimonialCard 
            name="David Chen"
            role="Environmental Advocate"
            content="I've been able to reduce my household waste by 70% thanks to the daily tracking and smart suggestions. The gamification keeps me motivated to improve every day."
            rating={5}
            imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
          />
          
          <TestimonialCard 
            name="Sarah Miller"
            role="Busy Professional"
            content="The meal planning feature has been a game-changer for me. I save time, eat healthier, and love seeing the environmental impact of my food choices quantified."
            rating={4}
            imageSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
          />
          
          <TestimonialCard 
            name="Michael Torres"
            role="Fitness Coach"
            content="I recommend Sustainify to all my clients. The ability to track both fitness progress and environmental impact in one app has been revolutionary for holistic health."
            rating={5}
            imageSrc="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
          />
          
          <TestimonialCard 
            name="Aisha Patel"
            role="Sustainability Blogger"
            content="The community challenges keep me accountable and connected. I've made friends with similar values and together we've planted over 100 trees through the app rewards!"
            rating={5}
            imageSrc="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
          />
          
          <TestimonialCard 
            name="James Wilson"
            role="Tech Professional"
            content="As someone who travels frequently for work, I appreciate how Sustainify helps me maintain healthy habits and minimize my environmental impact even when I'm on the road."
            rating={4}
            imageSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
