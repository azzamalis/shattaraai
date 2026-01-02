
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ExamPrepStepOneRedesignedProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

// Progress bar component (matching Steps 2 and 3)
function ExamProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-10 flex justify-center">
      <div className="flex w-1/4 max-w-md gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="h-1.5 flex-1 rounded-full bg-muted">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index < currentStep ? "bg-green-500" : "bg-muted-foreground/20"
              }`}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamPrepStepOneRedesigned({
  selectedCount,
  totalCount,
  isAllSelected,
  onToggleSelectAll,
  onNext,
  currentStep = 1,
  totalSteps = 3
}: ExamPrepStepOneRedesignedProps) {
  return (
    <div className="flex min-h-[460px] w-full flex-col items-center gap-6 rounded-3xl border-2 border-secondary bg-background px-6 sm:px-10 pt-6 shadow-md duration-300 animate-in zoom-in-95 dark:bg-card dark:shadow-[0_0_8px_rgba(255,255,255,0.1)] sm:min-h-[420px] sm:gap-6 lg:px-24">
      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <ExamProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          <div className="mt-6 flex flex-col items-center gap-4 sm:mt-0">
            {/* Title and Subtitle */}
            <h2 className="text-center text-lg font-normal leading-relaxed sm:text-2xl 2xl:text-3xl text-foreground">
              Build Your Perfect Exam
            </h2>
            <p className="mb-2 text-center text-sm text-muted-foreground sm:text-base 2xl:text-lg">
              You're steps away from a tailored exam — based on the topics you choose
            </p>

            {/* Instructions */}
            <p className="text-center text-foreground text-sm sm:text-base">
              Select the content cards below to include in your exam
            </p>

            {/* Select All and Continue */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4">
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
            </div>

            {/* Navigation Buttons */}
            <div className="mb-6 mt-4 flex flex-row gap-3">
              <Button 
                onClick={onNext} 
                disabled={selectedCount === 0} 
                className={cn(
                  "gap-1",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Continue
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
