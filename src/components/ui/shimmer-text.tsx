import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerText({ children, className }: ShimmerTextProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-r from-muted-foreground/60 via-primary/80 to-muted-foreground/60 bg-clip-text text-transparent animate-pulse",
      "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      className
    )}>
      <span className="relative">{children}</span>
    </div>
  );
}