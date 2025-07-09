
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={cn("flex items-center justify-center gap-2 py-2", className)}>
      <Sun className={cn(
        "h-4 w-4 transition-colors",
        isDark ? "text-muted-foreground" : "text-amber-500"
      )} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className={cn(
          "data-[state=checked]:bg-primary",
          "data-[state=unchecked]:bg-muted"
        )}
      />
      <Moon className={cn(
        "h-4 w-4 transition-colors",
        isDark ? "text-blue-400" : "text-muted-foreground"
      )} />
    </div>
  );
}
