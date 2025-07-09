
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
      <span>SHATTARA </span>
      <span style={{ color: '#00A3FF' }}>AI</span>
    </div>
  );
};

export default Logo;
