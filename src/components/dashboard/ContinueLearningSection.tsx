
import React from 'react';
import { LearningCard } from './LearningCard';

interface ContinueLearningProps {
  onDeleteCard: () => void;
  onShareCard: () => void;
}

export function ContinueLearningSection({ onDeleteCard, onShareCard }: ContinueLearningProps) {
  return (
    <div className="mt-8">
      {/* Header with View all link */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Continue learning</h2>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">View all</button>
      </div>
      
      {/* Card container */}
      <div className="flex flex-col gap-4">
        {/* Learning card */}
        <LearningCard 
          title="Python Language" 
          onDelete={onDeleteCard}
          onShare={onShareCard}
        />
      </div>
    </div>
  );
}
