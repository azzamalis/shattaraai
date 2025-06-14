
import React from 'react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/components/ThemeProvider';

interface LogoProps {
  className?: string;
  textColor?: string;
  lightLogo?: string;
  darkLogo?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  textColor = 'text-black',
  lightLogo = "/lovable-uploads/88dfb89e-dd52-48e1-bad9-3bcf54fae494.png",
  darkLogo = "/lovable-uploads/bc26c57b-aba9-45a1-a5ec-9a30966dc5c0.png"
}) => {
  const { isDark } = useThemeContext();
  
  const currentLogo = isDark ? darkLogo : lightLogo;
  
  return (
    <div className={cn('flex items-center font-medium text-2xl', className)}>
      <img 
        alt="SHATTARA AI" 
        className="w-auto h-auto object-contain" 
        style={{
          maxHeight: '40px',
          width: 'auto'
        }} 
        src={currentLogo} 
      />
    </div>
  );
};

export default Logo;
