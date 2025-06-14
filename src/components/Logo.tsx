import React from 'react';
import { cn } from '@/lib/utils';
interface LogoProps {
  className?: string;
  textColor?: string;
}
const Logo: React.FC<LogoProps> = ({
  className,
  textColor = 'text-black'
}) => {
  return <div className={cn('flex items-center font-medium text-2xl', className)}>
      <img alt="SHATTARA AI" className="w-auto h-auto object-contain" style={{
      maxHeight: '40px',
      width: 'auto'
    }} src="/lovable-uploads/bc26c57b-aba9-45a1-a5ec-9a30966dc5c0.png" />
    </div>;
};
export default Logo;