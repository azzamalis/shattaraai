
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface LogoProps {
  className?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  textColor = 'text-foreground'
}) => {
  const { isDark } = useTheme();
  
  // Use light logo in dark mode, dark logo in light mode
  const lightLogo = "/lovable-uploads/aeda6634-7453-400c-a3dd-48ced0ef7b0f.png";
  const darkLogo = "/lovable-uploads/88dfb89e-dd52-48e1-bad9-3bcf54fae494.png";

  return (
    <div className={cn('flex items-center font-medium text-2xl', className)}>
      {/* Light logo - shown in dark mode */}
      <img 
        alt="SHATTARA AI" 
        className={cn(
          "w-auto h-auto object-contain transition-opacity duration-200",
          isDark ? "opacity-100" : "opacity-0 absolute"
        )}
        style={{
          maxHeight: '40px',
          width: 'auto'
        }} 
        src={lightLogo} 
      />
      
      {/* Dark logo - shown in light mode */}
      <img 
        alt="SHATTARA AI" 
        className={cn(
          "w-auto h-auto object-contain transition-opacity duration-200",
          isDark ? "opacity-0 absolute" : "opacity-100"
        )}
        style={{
          maxHeight: '40px',
          width: 'auto'
        }} 
        src={darkLogo} 
      />
    </div>
  );
};

export default Logo;
