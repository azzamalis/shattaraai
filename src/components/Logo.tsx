
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  textColor = 'text-foreground'
}) => {
  return (
    <div className={cn('flex items-center font-bold text-2xl text-foreground transition-colors duration-200', className)}>
      SHATTARA AI
    </div>
  );
};

export default Logo;
