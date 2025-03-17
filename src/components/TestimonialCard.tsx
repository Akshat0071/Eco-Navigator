
import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  imageSrc?: string;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  rating,
  imageSrc,
  className,
}) => {
  return (
    <div className={cn(
      "glass-card-hover p-6 animate-scale-up",
      className
    )}>
      <div className="flex items-center mb-4">
        {imageSrc ? (
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-eco-100">
            <img 
              src={imageSrc} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-eco-100 flex items-center justify-center mr-4 border-2 border-eco-100">
            <span className="text-eco-600 font-semibold text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "w-4 h-4", 
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
      
      <p className="text-muted-foreground italic">"{content}"</p>
    </div>
  );
};

export default TestimonialCard;
