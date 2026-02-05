import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textColor?: string;
  linkTo?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({
  className,
  textColor = 'text-foreground',
  linkTo,
  onClick
}) => {
  const handleClick = () => {
    onClick?.();
    if (linkTo) {
      // Navigation handled by Link component
    } else if (!linkTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const content = (
    <>
      <span>SHATTARA </span>
      <span style={{ color: '#0069D6' }} className="px-[2px]">AI</span>
    </>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={cn('flex items-center font-bold text-2xl text-foreground transition-colors duration-200 cursor-pointer hover:opacity-80', className)}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn('flex items-center font-bold text-2xl text-foreground transition-colors duration-200 cursor-pointer hover:opacity-80', className)} 
      onClick={handleClick}
    >
      {content}
    </div>
  );
};

export default Logo;