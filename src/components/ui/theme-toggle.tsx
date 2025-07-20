
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Handle the toggle - switch between light and dark only
  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };
  
  // Determine if switch should be checked (dark mode)
  // Use resolvedTheme to get the actual applied theme
  const isChecked = resolvedTheme === 'dark';

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isChecked}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
