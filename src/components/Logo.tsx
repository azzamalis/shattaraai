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
      <img alt="SHATTARA AI" style={{
      maxHeight: '40px',
      width: 'auto'
    }} src="/lovable-uploads/88dfb89e-dd52-48e1-bad9-3bcf54fae494.png" className="w-auto h-auto object-fill " />
    </div>;
};
export default Logo;