
import React, { useState } from 'react';
import { Star, Plus, GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlashcardData } from './Flashcard';

interface ManagementCardProps {
  card: FlashcardData;
  index: number;
  isExpanded: boolean;
  isStarred: boolean;
  onToggleExpansion: () => void;
  onToggleStar: () => void;
  onAddBelow: () => void;
  onDelete: () => void;
}

export function ManagementCard({
  card,
  index,
  isExpanded,
  isStarred,
  onToggleExpansion,
  onToggleStar,
  onAddBelow,
  onDelete
}: ManagementCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative bg-dashboard-card rounded-xl p-6 border border-dashboard-separator/20 hover:border-dashboard-separator/40 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-dashboard-text-secondary text-sm font-medium">
            Card {index + 1}
          </span>
          <button 
            onClick={onToggleStar}
            className="p-1 hover:bg-dashboard-bg rounded-lg transition-colors"
          >
            <Star className={cn(
              "w-4 h-4 transition-colors",
              isStarred 
                ? "text-yellow-500 fill-yellow-500" 
                : "text-dashboard-text-secondary hover:text-dashboard-text"
            )} />
          </button>
          {card.concept && (
            <span className="bg-dashboard-bg text-dashboard-text px-3 py-1 rounded-full text-xs font-medium border border-dashboard-separator/20">
              {card.concept}
            </span>
          )}
        </div>
        
        {isHovered && (
          <div className="flex items-center gap-2">
            <button 
              onClick={onAddBelow}
              className="flex items-center gap-1 text-sm text-dashboard-text-secondary hover:text-dashboard-text transition-colors px-2 py-1 rounded-lg hover:bg-dashboard-bg"
            >
              <Plus className="w-4 h-4" />
              <span>Add below</span>
            </button>
            <button className="text-dashboard-text-secondary hover:text-dashboard-text cursor-move p-1 rounded-lg hover:bg-dashboard-bg transition-colors">
              <GripVertical className="w-4 h-4" />
            </button>
            <button 
              onClick={onDelete}
              className="text-dashboard-text-secondary hover:text-red-400 p-1 rounded-lg hover:bg-dashboard-bg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-dashboard-text font-medium mb-3 text-sm">Term</h4>
          <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
            {card.question}
          </div>
        </div>

        <div>
          <h4 className="text-dashboard-text font-medium mb-3 text-sm">Definition</h4>
          <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
            {card.answer}
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6 border-t border-dashboard-separator/20 pt-6">
            {card.hint && (
              <div>
                <h4 className="text-dashboard-text font-medium mb-3 text-sm">Hint</h4>
                <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                  {card.hint}
                </div>
              </div>
            )}

            {card.explanation && (
              <div>
                <h4 className="text-dashboard-text font-medium mb-3 text-sm">Explanation</h4>
                <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                  {card.explanation}
                </div>
              </div>
            )}

            {card.source && (
              <div>
                <h4 className="text-dashboard-text font-medium mb-3 text-sm">Source</h4>
                <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                  {card.source}
                </div>
              </div>
            )}

            {card.page && (
              <div>
                <h4 className="text-dashboard-text font-medium mb-3 text-sm">Page</h4>
                <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                  {card.page}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-dashboard-text font-medium mb-3 text-sm">Key concept</h4>
              <select className="w-full bg-dashboard-bg border border-dashboard-separator/20 rounded-xl p-4 text-dashboard-text focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/20 focus:border-[#00A3FF]/30 transition-all">
                <option value={card.concept || ""}>{card.concept || "Select concept"}</option>
                <option value="European Capitals">European Capitals</option>
                <option value="Solar System">Solar System</option>
                <option value="Chemical Formulas">Chemical Formulas</option>
                <option value="Renaissance Art">Renaissance Art</option>
                <option value="Asian Capitals">Asian Capitals</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={onToggleExpansion}
        className="text-dashboard-text-secondary text-sm mt-6 hover:text-dashboard-text transition-colors font-medium"
      >
        {isExpanded ? 'Show less' : 'Show more options'}
      </button>
    </div>
  );
}
