import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textColor?: string;
  linkTo?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  textColor = 'text-foreground',
  linkTo
}) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (linkTo) {
      navigate(linkTo);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={cn('flex items-center font-bold text-2xl text-foreground transition-colors duration-200 cursor-pointer hover:opacity-80', className)} 
      onClick={handleLogoClick}
    >
      <span>SHATTARA </span>
      <span style={{ color: '#0069D6' }} className="px-[2px]">AI</span>
    </div>
  );
};

export default Logo;