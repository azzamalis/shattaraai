// src/components/ui/base-modal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  contentClassName?: string;
}
export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  contentClassName
}: BaseModalProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("bg-card border border-border", contentClassName, className)}>
        {showCloseButton && <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            
            <span className="sr-only">Close</span>
          </button>}

        

        {children}
      </DialogContent>
    </Dialog>;
}