
import React from 'react';

interface CircularProgressProps {
  percentage: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width="150" height="150">
        <circle
          className="stroke-border"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
        />
        <circle
          className="stroke-orange-500 transition-all duration-700 ease-in-out"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{percentage.toFixed(1)}%</span>
        <span className="text-sm text-muted-foreground">Score</span>
      </div>
    </div>
  );
};
