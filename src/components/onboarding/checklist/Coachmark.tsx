import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { OnboardingTask } from '@/config/onboardingTasks';

interface CoachmarkProps {
  task: OnboardingTask;
  onDismiss: () => void;
}

interface Position {
  top: number;
  left: number;
  arrowPosition: 'top' | 'bottom' | 'left' | 'right';
}

export function Coachmark({ task, onDismiss }: CoachmarkProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const calculatePosition = () => {
      const element = document.getElementById(task.targetId);
      if (!element) {
        setIsVisible(false);
        return;
      }

      const rect = element.getBoundingClientRect();
      const padding = 12;
      const coachmarkWidth = 280;
      const coachmarkHeight = 80;

      // Determine best position
      let top = 0;
      let left = 0;
      let arrowPosition: Position['arrowPosition'] = 'bottom';

      // Try positioning below the element
      if (rect.bottom + coachmarkHeight + padding < window.innerHeight) {
        top = rect.bottom + padding;
        left = rect.left + rect.width / 2 - coachmarkWidth / 2;
        arrowPosition = 'top';
      }
      // Try positioning above
      else if (rect.top - coachmarkHeight - padding > 0) {
        top = rect.top - coachmarkHeight - padding;
        left = rect.left + rect.width / 2 - coachmarkWidth / 2;
        arrowPosition = 'bottom';
      }
      // Try positioning to the right
      else if (rect.right + coachmarkWidth + padding < window.innerWidth) {
        top = rect.top + rect.height / 2 - coachmarkHeight / 2;
        left = rect.right + padding;
        arrowPosition = 'left';
      }
      // Position to the left
      else {
        top = rect.top + rect.height / 2 - coachmarkHeight / 2;
        left = rect.left - coachmarkWidth - padding;
        arrowPosition = 'right';
      }

      // Clamp to viewport
      left = Math.max(padding, Math.min(left, window.innerWidth - coachmarkWidth - padding));
      top = Math.max(padding, Math.min(top, window.innerHeight - coachmarkHeight - padding));

      setPosition({ top, left, arrowPosition });
      setIsVisible(true);
    };

    // Initial calculation
    calculatePosition();

    // Watch for DOM changes (element might be rendered later)
    observerRef.current = new MutationObserver(calculatePosition);
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Recalculate on scroll/resize
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [task.targetId]);

  if (!isVisible || !position) return null;

  const arrowStyles: Record<Position['arrowPosition'], string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-card',
    bottom: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-card',
    left: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-card',
    right: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-card',
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-[60] w-[280px]"
        style={{ top: position.top, left: position.left }}
      >
        <div className="relative rounded-lg border border-border bg-card p-3 shadow-lg">
          {/* Arrow */}
          <div
            className={`absolute h-0 w-0 border-[6px] ${arrowStyles[position.arrowPosition]}`}
          />
          
          {/* Content */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-foreground">{task.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
            </div>
            <button
              onClick={onDismiss}
              className="shrink-0 rounded-full p-1 hover:bg-accent"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
