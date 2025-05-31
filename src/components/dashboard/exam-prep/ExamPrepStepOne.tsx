
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ContentItem } from './types';
import { ContentItemCard } from './ContentItemCard';

interface ExamPrepStepOneProps {
  contentItems: ContentItem[];
  onToggleSelectAll: () => void;
  onToggleItemSelection: (id: string) => void;
  onNext: () => void;
}

export function ExamPrepStepOne({ 
  contentItems, 
  onToggleSelectAll, 
  onToggleItemSelection, 
  onNext 
}: ExamPrepStepOneProps) {
  const selectedCount = contentItems.filter(item => item.isSelected).length;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Choose contents to have for your exam below
      </h2>
      <p className="text-muted-foreground mb-8">
        An exam will be generated based on these contents
      </p>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="space-y-3">
          {contentItems.map(item => (
            <ContentItemCard
              key={item.id}
              item={item}
              onToggle={() => onToggleItemSelection(item.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSelectAll}
            className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <div className={cn(
              "w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200",
              selectedCount === contentItems.length ? "bg-primary border-primary" : "border-muted-foreground"
            )}>
              {selectedCount === contentItems.length && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
            <span>Select All ({selectedCount}/{contentItems.length})</span>
          </button>
        </div>
        <Button 
          onClick={onNext}
          disabled={selectedCount === 0}
          className={cn(
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors px-4",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
