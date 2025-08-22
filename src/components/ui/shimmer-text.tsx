import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerText({ children, className }: ShimmerTextProps) {
  return (
    <div className={cn(
      "relative overflow-hidden text-card-foreground",
      className
    )}>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
    </div>
  );
}