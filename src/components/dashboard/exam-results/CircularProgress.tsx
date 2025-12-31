import React from 'react';

interface CircularProgressProps {
  percentage: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const scoreColor = getScoreColor(percentage);

  return (
    <div className="relative flex h-24 w-24 flex-col items-center justify-center sm:h-32 sm:w-32">
      <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100">
        <circle
          className="stroke-current text-primary/5 dark:text-primary/10"
          strokeWidth="10"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
        />
        <circle
          className={`${scoreColor} stroke-current`}
          strokeWidth="10"
          strokeLinecap="butt"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="z-10 text-xl font-bold text-neutral-700 dark:text-primary sm:text-2xl">
        {percentage.toFixed(1)}%
      </span>
      <span className="z-10 text-xs text-muted-foreground dark:text-muted-foreground sm:text-sm">
        Score
      </span>
    </div>
  );
};