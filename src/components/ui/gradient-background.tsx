// src/components/ui/gradient-background.tsx
import React from 'react';

interface GradientBackgroundProps {
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ className = "" }) => {
  return (
    <>
      {/* Main gradient background */}
      <div 
        aria-hidden 
        className={`absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,#000 30%,#2323FF_100%)] ${className}`} 
      />
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="absolute top-1/3 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-2/3 right-20 w-32 h-32 rounded-full bg-primary/20 blur-3xl opacity-15 animate-[pulse_4s_infinite]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 rounded-full bg-primary/30 blur-3xl opacity-10 animate-[pulse_5s_infinite]"></div>
      </div>
    </>
  );
};

export default GradientBackground;