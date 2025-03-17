
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  iconBg = 'bg-eco-100',
  iconColor = 'text-eco-600',
  className,
}) => {
  return (
    <div className={cn(
      "glass-card-hover p-6 flex flex-col items-start animate-scale-up",
      className
    )}>
      <div className={cn("p-3 rounded-xl mb-4", iconBg)}>
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
