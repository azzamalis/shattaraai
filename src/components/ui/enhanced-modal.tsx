
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  preventClose?: boolean;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-[95vw] max-h-[95vh]'
};

export function EnhancedModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = 'md',
  showCloseButton = true,
  preventClose = false,
  footer
}: EnhancedModalProps) {
  const handleClose = () => {
    if (!preventClose) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90",
          "border border-border/50 shadow-2xl",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          sizeClasses[size],
          className
        )}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-4 top-4 z-50",
                    "h-8 w-8 rounded-full",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-accent/50 transition-colors",
                    "focus:ring-2 focus:ring-primary/20"
                  )}
                  onClick={handleClose}
                  disabled={preventClose}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              )}

              <DialogHeader className="space-y-3 pb-4">
                <DialogTitle className="text-xl font-semibold text-foreground leading-tight">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                {children}
              </div>

              {footer && (
                <div className="flex justify-end gap-3 pt-6 border-t border-border/50 mt-6">
                  {footer}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
