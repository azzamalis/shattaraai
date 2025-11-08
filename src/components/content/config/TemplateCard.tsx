import React from 'react';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function TemplateCard({ title, description, selected, onClick }: TemplateCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
        selected
          ? "bg-primary/5 dark:bg-primary/10 border-primary"
          : "border-border bg-background hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
        selected ? "border-primary" : "border-muted-foreground"
      )}>
        {selected && <div className="w-2 h-2 rounded-full bg-primary" />}
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium">{title}</span>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
