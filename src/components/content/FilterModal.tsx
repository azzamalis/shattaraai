
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dashboard-card text-dashboard-text rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-dashboard-text-secondary" />
            <h2 className="text-lg font-semibold text-dashboard-text">Filter Options</h2>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-dashboard-text-secondary hover:text-dashboard-text transition-colors p-1 rounded-lg hover:bg-dashboard-bg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Starred Only Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashboard-separator/20 hover:border-dashboard-separator/40 transition-all hover:bg-dashboard-bg/50">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-dashboard-text">Starred only</span>
              </div>
              <Switch
                checked={tempFilters.starredOnly}
                onCheckedChange={handleStarredToggle}
                disabled={!hasStarredCards}
                className="data-[state=checked]:bg-[#00A3FF] data-[state=unchecked]:bg-dashboard-separator/30"
              />
            </div>
            {!hasStarredCards && (
              <p className="text-xs text-dashboard-text-secondary ml-4">
                No starred cards available
              </p>
            )}
          </div>

          {/* Concept Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-dashboard-text">Filter by Key concepts</h3>
              <span className="text-xs text-dashboard-text-secondary bg-dashboard-bg px-2 py-1 rounded-full">
                {tempFilters.concepts.length} selected
              </span>
            </div>
            
            {/* Selected Concepts Chips */}
            {tempFilters.concepts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tempFilters.concepts.map((concept) => (
                  <div 
                    key={concept}
                    className="inline-flex items-center gap-2 bg-dashboard-bg border border-dashboard-separator/20 rounded-full px-3 py-2 text-sm w-fit"
                  >
                    <span className="text-dashboard-text whitespace-nowrap">{concept}</span>
                    <button 
                      onClick={() => removeConcept(concept)}
                      className="text-dashboard-text-secondary hover:text-dashboard-text transition-colors flex-shrink-0"
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
                  className="w-full bg-dashboard-bg border border-dashboard-separator/20 rounded-xl px-4 py-3 text-sm text-dashboard-text focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/20 focus:border-[#00A3FF]/30 transition-all"
                >
                  <option value="">Select key concepts</option>
                  {availableConcepts
                    .filter(concept => !tempFilters.concepts.includes(concept))
                    .map((concept) => (
                      <option key={concept} value={concept} className="bg-dashboard-bg text-dashboard-text">
                        {concept}
                      </option>
                    ))
                  }
                </select>
              </div>
            ) : (
              <p className="text-xs text-dashboard-text-secondary bg-dashboard-bg/50 p-3 rounded-xl text-center">
                No concepts available
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-dashboard-separator/10">
          <button 
            onClick={handleClearAll}
            className="text-sm text-dashboard-text-secondary hover:text-dashboard-text transition-colors font-medium"
          >
            Clear all
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm bg-dashboard-bg text-dashboard-text rounded-lg hover:bg-dashboard-separator/20 transition-colors font-medium border border-dashboard-separator/20"
            >
              Cancel
            </button>
            <button 
              onClick={handleFilterApply}
              className="px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
