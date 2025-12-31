import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingProgressProps {
  progress: number;
  isAnimating?: boolean;
}

export function OnboardingProgress({ progress, isAnimating = false }: OnboardingProgressProps) {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-onboarding-progress">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-onboarding-gradient-start to-onboarding-gradient-end"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      {isAnimating && (
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-white/30"
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: `${progress}%`,
            opacity: [0, 0.5, 0],
          }}
          transition={{ 
            duration: 1,
            repeat: 2,
          }}
        />
      )}
    </div>
  );
}
