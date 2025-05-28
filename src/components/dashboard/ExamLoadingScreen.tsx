
import React, { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ExamLoadingScreenProps {
  onComplete?: () => void;
}

const loadingSteps = [
  "Preparing your exam materials",
  "Analyzing existing contents", 
  "Generating question types",
  "Structuring exam preference",
  "Reviewing final criteria"
];

export function ExamLoadingScreen({ onComplete }: ExamLoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { isDark } = useTheme();

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const processSteps = () => {
      loadingSteps.forEach((_, index) => {
        const timeout = setTimeout(() => {
          if (index < loadingSteps.length - 1) {
            setCompletedSteps(prev => [...prev, index]);
            setCurrentStep(index + 1);
          } else {
            // Complete the final step
            setCompletedSteps(prev => [...prev, index]);
          }
        }, (index + 1) * 2500);
        
        timeouts.push(timeout);
      });
    };

    processSteps();

    // Cleanup function to clear all timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Handle completion when all steps are done
  useEffect(() => {
    if (completedSteps.length === loadingSteps.length && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [completedSteps.length, onComplete]);

  const getStepState = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      return 'completed';
    } else if (stepIndex === currentStep) {
      return 'loading';
    } else {
      return 'pending';
    }
  };

  const getStepIcon = (stepIndex: number) => {
    const state = getStepState(stepIndex);
    
    switch (state) {
      case 'loading':
        return <Loader2 className="w-5 h-5 mr-3 animate-spin" />;
      case 'completed':
        return <Check className="w-5 h-5 mr-3 text-[#00a3ff]" />;
      default:
        return <div className="w-5 h-5 mr-3" />;
    }
  };

  const getStepTextColor = (stepIndex: number) => {
    const state = getStepState(stepIndex);
    
    switch (state) {
      case 'loading':
      case 'completed':
        return isDark ? 'text-white' : 'text-[#171717]';
      default:
        return isDark ? 'text-[#A6A6A6]' : 'text-[#A6A6A6]';
    }
  };

  return (
    <div 
      className={`h-screen flex items-center justify-center ${
        isDark ? 'bg-[#121212]' : 'bg-[#FAFAFA]'
      }`}
    >
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center"
            >
              {getStepIcon(index)}
              <span className={`text-lg ${getStepTextColor(index)}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
