
import React, { useState } from 'react';
import { X, Star, SlidersHorizontal } from 'lucide-react';
import { FlashcardFilter } from '@/lib/flashcardTypes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FlashcardFilter;
  onApplyFilters: (filters: FlashcardFilter) => void;
  availableConcepts: string[];
}

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  availableConcepts
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FlashcardFilter>(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FlashcardFilter = {
      starredOnly: false,
      selectedConcepts: [],
      showStudiedOnly: false,
      difficulty: null
    };
    setLocalFilters(clearedFilters);
  };

  const toggleConcept = (concept: string) => {
    setLocalFilters(prev => ({
      ...prev,
      selectedConcepts: prev.selectedConcepts.includes(concept)
        ? prev.selectedConcepts.filter(c => c !== concept)
        : [...prev.selectedConcepts, concept]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-dashboard-card rounded-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-dashboard-text" />
            <h2 className="text-lg font-semibold text-dashboard-text">Filter Options</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-dashboard-text-secondary hover:text-dashboard-text"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Starred Only Toggle */}
          <div>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-border/80 cursor-pointer transition-colors bg-dashboard-bg">
              <input
                type="checkbox"
                checked={localFilters.starredOnly}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  starredOnly: e.target.checked
                }))}
                className="w-4 h-4 rounded border-border focus:ring-primary"
              />
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-dashboard-text">Starred only</span>
            </label>
          </div>

          {/* Studied Only Toggle */}
          <div>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-border/80 cursor-pointer transition-colors bg-dashboard-bg">
              <input
                type="checkbox"
                checked={localFilters.showStudiedOnly || false}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  showStudiedOnly: e.target.checked
                }))}
                className="w-4 h-4 rounded border-border focus:ring-primary"
              />
              <span className="text-sm text-dashboard-text">Studied cards only</span>
            </label>
          </div>

          {/* Concept Filter */}
          {availableConcepts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-dashboard-text">Filter by concepts</h3>
                <span className="text-xs text-dashboard-text-secondary">
                  {localFilters.selectedConcepts.length} selected
                </span>
              </div>

              {/* Selected Concepts */}
              {localFilters.selectedConcepts.length > 0 && (
                <div className="space-y-2 mb-3">
                  {localFilters.selectedConcepts.map((concept) => (
                    <div
                      key={concept}
                      className="flex items-center justify-between bg-dashboard-bg rounded-full px-3 py-2 text-sm border border-border"
                    >
                      <span className="flex-1 truncate text-dashboard-text">{concept}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleConcept(concept)}
                        className="w-6 h-6 text-dashboard-text-secondary hover:text-dashboard-text"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Concepts */}
              <div className="max-h-32 overflow-y-auto space-y-1">
                {availableConcepts
                  .filter(concept => !localFilters.selectedConcepts.includes(concept))
                  .map((concept) => (
                    <button
                      key={concept}
                      onClick={() => toggleConcept(concept)}
                      className="w-full text-left px-3 py-2 text-sm text-dashboard-text hover:bg-dashboard-card-hover rounded-lg transition-colors border border-transparent hover:border-border"
                    >
                      {concept}
                    </button>
                  ))
                }
              </div>
            </div>
          )}

          {/* Difficulty Filter */}
          <div>
            <h3 className="text-sm font-medium text-dashboard-text mb-3">Filter by difficulty</h3>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setLocalFilters(prev => ({
                    ...prev,
                    difficulty: prev.difficulty === difficulty ? null : difficulty
                  }))}
                  className={cn(
                    "px-3 py-2 text-xs rounded-lg border transition-colors capitalize",
                    localFilters.difficulty === difficulty
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-dashboard-bg text-dashboard-text border-border hover:border-border/80"
                  )}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-dashboard-text-secondary hover:text-dashboard-text"
          >
            Clear all
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
