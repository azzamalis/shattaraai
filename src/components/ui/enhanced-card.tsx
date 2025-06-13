
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default: 'bg-card border border-border shadow-sm',
  outline: 'border-2 border-border bg-transparent',
  ghost: 'bg-transparent shadow-none border-0'
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function EnhancedCard({
  children,
  className,
  hover = false,
  interactive = false,
  onClick,
  variant = 'default',
  size = 'md'
}: EnhancedCardProps) {
  const isClickable = interactive || onClick;

  return (
    <motion.div
      className={cn(
        'rounded-xl transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        {
          'hover:shadow-lg hover:scale-[1.02]': hover,
          'cursor-pointer': isClickable,
          'hover:bg-accent/5': isClickable && variant === 'default',
          'hover:border-primary/20': isClickable && variant === 'outline',
          'focus:outline-none focus:ring-2 focus:ring-primary/20': isClickable
        },
        className
      )}
      onClick={onClick}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}
