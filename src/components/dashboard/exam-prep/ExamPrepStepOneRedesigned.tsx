
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ExamPrepStepOneRedesignedProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

// Shared progress bar component
function ExamProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="flex w-1/4 max-w-md gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="h-1.5 flex-1 rounded-full bg-muted">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index < currentStep ? "bg-green-500" : "bg-neutral-200 dark:bg-neutral-800"
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
    <div className="flex min-h-[460px] w-full flex-col items-center gap-6 rounded-3xl border-2 border-secondary bg-white px-10 pt-6 shadow-md duration-300 animate-in zoom-in-95 dark:bg-neutral-900/80 dark:shadow-[0_0_8px_rgba(255,255,255,0.1)] sm:min-h-[420px] sm:gap-6 lg:px-24">
      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <ExamProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          <div className="flex flex-col gap-4">
            {/* Title */}
            <h2 className="mt-4 text-center text-xl font-normal leading-relaxed sm:mt-6 sm:text-2xl 2xl:text-3xl text-foreground">
              Choose contents to have for your exam below
            </h2>
            
            {/* Subtitle */}
            <p className="mb-12 text-center text-base text-muted-foreground sm:mb-4 sm:text-base 2xl:text-lg">
              An exam will be generated based on these contents
            </p>

            {/* Select All and Continue in a row */}
            <div className="flex flex-row justify-center gap-5">
              <div 
                className="flex cursor-pointer flex-row items-center gap-2"
                onClick={onToggleSelectAll}
              >
                <Checkbox 
                  id="contentsSelection"
                  checked={isAllSelected} 
                  onCheckedChange={onToggleSelectAll}
                  className="h-5 w-5 rounded-[6px] border-[1.5px] border-primary/60 bg-primary-foreground text-primary data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                />
                <label htmlFor="contentsSelection" className="cursor-pointer">
                  <span className="text-foreground">Select All</span>
                  <span className="pl-0.5 text-sm text-muted-foreground">
                    ({selectedCount}/{totalCount})
                  </span>
                </label>
              </div>
              
              <Button 
                onClick={onNext} 
                disabled={selectedCount === 0}
                className="gap-1"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
