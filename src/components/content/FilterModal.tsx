
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Star, SlidersHorizontal } from 'lucide-react';
import { FilterOptions } from './Flashcard';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilter: (filters: FilterOptions) => void;
  hasStarredCards: boolean;
  availableConcepts: string[];
}

export function FilterModal({
  open,
  onOpenChange,
  onFilter,
  hasStarredCards,
  availableConcepts,
}: FilterModalProps) {
  const [tempFilters, setTempFilters] = useState<FilterOptions>({
    starredOnly: false,
    concepts: [],
  });

  const addConcept = (concept: string) => {
    if (!tempFilters.concepts.includes(concept)) {
      setTempFilters(prev => ({
        ...prev,
        concepts: [...prev.concepts, concept]
      }));
    }
  };

  const removeConcept = (concept: string) => {
    setTempFilters(prev => ({
      ...prev,
      concepts: prev.concepts.filter(c => c !== concept)
    }));
  };

  const handleFilterApply = () => {
    onFilter(tempFilters);
    onOpenChange(false);
  };

  const handleClearAll = () => {
    setTempFilters({ starredOnly: false, concepts: [] });
  };

  const handleStarredToggle = (checked: boolean) => {
    setTempFilters(prev => ({ ...prev, starredOnly: checked }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border text-card-foreground rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-card-foreground">Filter Options</h2>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-muted-foreground hover:text-card-foreground transition-colors p-1 rounded-lg hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Starred Only Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-border transition-all hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-card-foreground">Starred only</span>
              </div>
              <Switch
                checked={tempFilters.starredOnly}
                onCheckedChange={handleStarredToggle}
                disabled={!hasStarredCards}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
              />
            </div>
            {!hasStarredCards && (
              <p className="text-xs text-muted-foreground ml-4">
                No starred cards available
              </p>
            )}
          </div>

          {/* Concept Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-card-foreground">Filter by Key concepts</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {tempFilters.concepts.length} selected
              </span>
            </div>
            
            {/* Selected Concepts Chips */}
            {tempFilters.concepts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tempFilters.concepts.map((concept) => (
                  <div 
                    key={concept}
                    className="inline-flex items-center gap-2 bg-secondary border border-border/50 rounded-full px-3 py-2 text-sm w-fit"
                  >
                    <span className="text-secondary-foreground whitespace-nowrap">{concept}</span>
                    <button 
                      onClick={() => removeConcept(concept)}
                      className="text-muted-foreground hover:text-secondary-foreground transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Concept Dropdown */}
            {availableConcepts.length > 0 ? (
              <div className="relative">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      addConcept(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                >
                  <option value="">Select key concepts</option>
                  {availableConcepts
                    .filter(concept => !tempFilters.concepts.includes(concept))
                    .map((concept) => (
                      <option key={concept} value={concept} className="bg-background text-foreground">
                        {concept}
                      </option>
                    ))
                  }
                </select>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-xl text-center">
                No concepts available
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-border/20">
          <button 
            onClick={handleClearAll}
            className="text-sm text-muted-foreground hover:text-card-foreground transition-colors font-medium"
          >
            Clear all
          </button>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleFilterApply}
              className="px-4 py-2 text-sm"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
