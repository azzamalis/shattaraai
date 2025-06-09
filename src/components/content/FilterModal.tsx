
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const [starredOnly, setStarredOnly] = useState(false);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);

  const handleConceptSelect = (concept: string) => {
    if (!selectedConcepts.includes(concept)) {
      setSelectedConcepts(prev => [...prev, concept]);
    }
  };

  const handleRemoveConcept = (concept: string) => {
    setSelectedConcepts(prev => prev.filter(c => c !== concept));
  };

  const handleClearAll = () => {
    setStarredOnly(false);
    setSelectedConcepts([]);
  };

  const handleApplyFilter = () => {
    onFilter({
      starredOnly,
      concepts: selectedConcepts,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Filter Flashcards</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Starred Only Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Show starred cards only
            </label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="starred-only"
                checked={starredOnly}
                onCheckedChange={setStarredOnly}
                disabled={!hasStarredCards}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="starred-only"
                className={cn(
                  "text-sm",
                  hasStarredCards 
                    ? "text-card-foreground cursor-pointer" 
                    : "text-muted-foreground cursor-not-allowed"
                )}
              >
                Starred cards only
              </label>
            </div>
            {!hasStarredCards && (
              <p className="text-xs text-muted-foreground">
                No starred cards available
              </p>
            )}
          </div>

          {/* Concept Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Filter by concepts
            </label>
            {availableConcepts.length > 0 ? (
              <>
                <Select onValueChange={handleConceptSelect}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select a concept" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {availableConcepts
                      .filter(concept => !selectedConcepts.includes(concept))
                      .map(concept => (
                        <SelectItem
                          key={concept}
                          value={concept}
                          className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          {concept}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {/* Selected Concepts as Chips */}
                {selectedConcepts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedConcepts.map(concept => (
                      <Badge
                        key={concept}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 pr-1"
                      >
                        {concept}
                        <button
                          onClick={() => handleRemoveConcept(concept)}
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                No concepts available
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="border-border text-card-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApplyFilter}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
