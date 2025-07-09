
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface LogoProps {
  className?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  textColor = 'text-black'
}) => {
  const { isDark } = useTheme();
  
  // Use the light mode logo when in light theme, dark mode logo when in dark theme
  const logoSrc = isDark 
    ? "/lovable-uploads/88dfb89e-dd52-48e1-bad9-3bcf54fae494.png" 
    : "/lovable-uploads/aeda6634-7453-400c-a3dd-48ced0ef7b0f.png";

  return (
    <div className={cn('flex items-center font-medium text-2xl', className)}>
      <img 
        alt="SHATTARA AI" 
        className="w-auto h-auto object-contain" 
        style={{
          maxHeight: '40px',
          width: 'auto'
        }} 
        src={logoSrc} 
      />
    </div>
  );
};

export default Logo;
