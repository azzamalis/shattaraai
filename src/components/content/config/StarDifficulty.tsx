import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarDifficultyProps {
  value: 'easy' | 'medium' | 'hard';
  onChange: (value: 'easy' | 'medium' | 'hard') => void;
}

export function StarDifficulty({ value, onChange }: StarDifficultyProps) {
  const options = [
    { value: 'easy' as const, label: 'Easy', stars: 1 },
    { value: 'medium' as const, label: 'Medium', stars: 2 },
    { value: 'hard' as const, label: 'Hard', stars: 3 },
  ];

  return (
    <div className="p-1.5 rounded-2xl border border-primary/20 bg-card w-full">
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl py-1.5 px-2 text-sm flex items-center transition-all duration-200 gap-1.5 border",
              value === option.value
                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                : "bg-background text-muted-foreground border-secondary/10 hover:border-secondary/50 hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-[2px]">
              {Array.from({ length: option.stars }).map((_, i) => (
                <Star key={i} className="h-[14px] w-[14px]" />
              ))}
            </span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
