import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ className, textColor = 'text-black' }) => {
  return (
    <div className={cn('flex items-center font-medium text-2xl', className)}>
      <img 
        src="/lovable-uploads/62e3dd77-6e9f-4134-9392-fc52478e7b24.png" 
        alt="SHATTARA AI" 
        className="w-auto h-auto object-contain"
        style={{ 
          maxHeight: '40px',
          width: 'auto'
        }}
      />
    </div>
  );
};

export default Logo;
