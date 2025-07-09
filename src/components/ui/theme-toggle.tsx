
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
      <Sun className={cn("h-4 w-4", isDark ? "text-muted-foreground" : "text-yellow-500")} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-slate-600 data-[state=unchecked]:bg-yellow-200"
      />
      <Moon className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-muted-foreground")} />
    </div>
  );
}
