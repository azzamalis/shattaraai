
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 active:shadow-inner': variant === 'primary',
            'border border-border text-foreground hover:bg-accent hover:text-accent-foreground active:shadow-inner': variant === 'outline',
            'text-foreground hover:bg-accent hover:text-accent-foreground active:shadow-inner': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline': variant === 'link',
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-5 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
