
import React from 'react';
import { cn } from '@/lib/utils';
import { Atom } from 'lucide-react';

interface LogoProps {
  className?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ className, textColor = 'text-black' }) => {
  return (
    <div className={cn('flex items-center font-bold text-2xl', className)}>
      <Atom className={cn("mr-2 text-primary", textColor === 'text-white' ? 'text-primary' : 'text-primary')} />
      <span className={cn(textColor)}>SHATTARA</span>
    </div>
  );
};

export default Logo;
