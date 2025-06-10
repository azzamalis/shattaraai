
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#4B4B4B] text-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filter Options</h2>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Starred Only Filter */}
        <div className="mb-6">
          <label className="flex items-center justify-between p-3 rounded-lg border border-gray-600 hover:border-gray-500 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Starred only</span>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                checked={tempFilters.starredOnly}
                disabled={!hasStarredCards}
                onChange={(e) => setTempFilters({...tempFilters, starredOnly: e.target.checked})}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                hasStarredCards 
                  ? (tempFilters.starredOnly ? 'bg-[#00A3FF]' : 'bg-gray-600') 
                  : 'bg-gray-700 opacity-50'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  tempFilters.starredOnly ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}></div>
              </div>
            </div>
          </label>
          {!hasStarredCards && (
            <p className="text-xs text-gray-400 mt-2 ml-3">
              No starred cards available
            </p>
          )}
        </div>

        {/* Concept Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Filter by Key concepts</h3>
            <span className="text-xs text-gray-400">{tempFilters.concepts.length} selected</span>
          </div>
          
          {/* Selected Concepts */}
          {tempFilters.concepts.length > 0 && (
            <div className="space-y-2 mb-3">
              {tempFilters.concepts.map((concept) => (
                <div 
                  key={concept}
                  className="flex items-center justify-between bg-gray-700 rounded-full px-3 py-2 text-sm"
                >
                  <span className="flex-1 truncate">{concept}</span>
                  <button 
                    onClick={() => removeConcept(concept)}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
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
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent"
              >
                <option value="">Select key concepts</option>
                {availableConcepts
                  .filter(concept => !tempFilters.concepts.includes(concept))
                  .map((concept) => (
                    <option key={concept} value={concept}>
                      {concept}
                    </option>
                  ))
                }
              </select>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              No concepts available
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button 
            onClick={handleClearAll}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Clear all
          </button>
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleFilterApply}
            className="px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
