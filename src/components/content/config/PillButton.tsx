import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PillButtonProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onClick: () => void;
  colorClass?: string;
}

export function PillButton({ icon: Icon, label, selected, onClick, colorClass }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl py-1.5 px-2 text-sm flex items-center transition-all duration-200 gap-1.5 border",
        selected
          ? colorClass || "bg-primary/10 text-primary border-primary/20"
          : "bg-background text-muted-foreground border-secondary/10 hover:border-secondary/50 hover:text-foreground"
      )}
    >
      <Icon className="h-[14px] w-[14px]" />
      {label}
    </button>
  );
}
