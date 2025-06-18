
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LandingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function LandingLayout({ children, className }: LandingLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cn("landing-layout min-h-screen", className)}>
      {/* Theme Toggle - Fixed positioned for easy access */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      
      {children}
    </div>
  );
}
