import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, PartyPopper } from 'lucide-react';

interface OnboardingCompletedProps {
  onDismiss: () => void;
}

export function OnboardingCompleted({ onDismiss }: OnboardingCompletedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="flex items-center gap-3 rounded-xl border border-onboarding-success/30 bg-onboarding-success/10 p-4 shadow-lg backdrop-blur-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-onboarding-success">
        <PartyPopper className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-semibold text-foreground">All done!</p>
        <p className="text-sm text-muted-foreground">You&apos;ve completed all onboarding tasks</p>
      </div>
    </motion.div>
  );
}
