import { Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
        <div className={`${sizeClasses[size]} bg-gradient-primary rounded-lg flex items-center justify-center relative`}>
          <Zap className="h-4 w-4 text-primary-foreground fill-current" />
        </div>
      </div>
      {showText && (
        <span className={`${textClasses[size]} font-display font-bold text-foreground`}>
          Flexion<span className="text-gradient">Pay</span>
        </span>
      )}
    </div>
  );
}
