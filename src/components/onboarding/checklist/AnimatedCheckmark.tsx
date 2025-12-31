import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCheckmarkProps {
  size?: number;
  className?: string;
}

export function AnimatedCheckmark({ size = 16, className = '' }: AnimatedCheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        className="fill-onboarding-success"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
      />
      <motion.path
        d="M8 12l2.5 2.5L16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}
