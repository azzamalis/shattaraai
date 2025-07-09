
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className={cn("flex items-center justify-between gap-3 px-2 py-2", className)}>
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-yellow-500" />
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-slate-800 data-[state=unchecked]:bg-yellow-100"
        />
        <Moon className="h-4 w-4 text-slate-600" />
      </div>
    </div>
  );
}
