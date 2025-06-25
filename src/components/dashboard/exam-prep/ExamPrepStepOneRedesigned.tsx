
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ExamPrepStepOneRedesignedProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onNext: () => void;
}

export function ExamPrepStepOneRedesigned({ 
  selectedCount,
  totalCount,
  isAllSelected,
  onToggleSelectAll,
  onNext 
}: ExamPrepStepOneRedesignedProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Build Your Perfect Exam
        </h2>
        <p className="text-muted-foreground">
          You're steps away from a tailored exam — based on the topics you choose
        </p>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <p className="text-foreground">
          Select the content cards below to include in your exam
        </p>
      </div>

      {/* Footer with Select All and Continue */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onToggleSelectAll}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span 
            className="text-sm font-medium text-foreground cursor-pointer select-none"
            onClick={onToggleSelectAll}
          >
            Select All
          </span>
          <span className="text-sm text-muted-foreground">
            ({selectedCount}/{totalCount})
          </span>
        </div>
        
        <Button 
          onClick={onNext}
          disabled={selectedCount === 0}
          className={cn(
            "bg-foreground hover:bg-foreground/90 text-background hover:text-background transition-all duration-200 hover:shadow-sm px-6",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
