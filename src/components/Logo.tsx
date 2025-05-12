
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ className, textColor = 'text-black' }) => {
  return (
    <div className={cn('flex items-center font-bold text-2xl', className)}>
      <span className={cn(textColor)}>SHATTARA</span>
    </div>
  );
};

export default Logo;
