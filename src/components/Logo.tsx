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
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <div className={cn('flex items-center font-bold text-2xl text-foreground transition-colors duration-200 cursor-pointer hover:opacity-80', className)} onClick={handleLogoClick}>
      <span>SHATTARA </span>
      <span style={{
      color: '#00A3FF'
    }} className="px-[2px]">AI</span>
    </div>;
};
export default Logo;