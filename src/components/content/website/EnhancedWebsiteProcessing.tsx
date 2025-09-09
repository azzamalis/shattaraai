import React, { useState, useEffect } from 'react';
import { Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { cn } from '@/lib/utils';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface EnhancedWebsiteProcessingProps {
  url: string;
  processingStatus: string;
  className?: string;
}

export function EnhancedWebsiteProcessing({ 
  url, 
  processingStatus, 
  className 
}: EnhancedWebsiteProcessingProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'fetch', label: 'Fetching webpage', status: 'pending' },
    { id: 'extract', label: 'Extracting content', status: 'pending' },
    { id: 'process', label: 'Processing structure', status: 'pending' },
    { id: 'analyze', label: 'Analyzing content', status: 'pending' }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (processingStatus === 'processing') {
      const timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex < steps.length) {
            setSteps(current => current.map((step, index) => ({
              ...step,
              status: index < nextIndex ? 'completed' : 
                      index === nextIndex ? 'processing' : 'pending'
            })));
            return nextIndex;
          }
          return prev;
        });
      }, 1200);

      return () => clearInterval(timer);
    } else if (processingStatus === 'completed') {
      setSteps(current => current.map(step => ({ ...step, status: 'completed' })));
    } else if (processingStatus === 'failed') {
      setSteps(current => current.map((step, index) => ({
        ...step,
        status: index <= currentStepIndex ? 'failed' : 'pending'
      })));
    }
  }, [processingStatus, currentStepIndex, steps.length]);

  // Extract domain for display
  const domain = React.useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }, [url]);

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  const getStepTextClass = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-destructive';
      case 'processing':
        return 'text-primary font-medium';
      default:
        return 'text-muted-foreground';
    }
  };

  if (processingStatus !== 'processing') {
    return null;
  }

  return (
    <div className={cn("mx-4 mt-2 p-6 bg-card border border-border rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Globe className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1 text-foreground">
            Processing Website
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {domain}
          </p>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            {getStepIcon(step.status)}
            <div className="flex-1">
              <p className={cn("text-sm transition-colors", getStepTextClass(step.status))}>
                {step.status === 'processing' ? (
                  `${step.label}...`
                ) : (
                  step.label
                )}
              </p>
            </div>
            {step.status === 'processing' && (
              <div className="flex items-center gap-1">
                <div className="h-1 w-1 bg-primary rounded-full animate-pulse" />
                <div className="h-1 w-1 bg-primary rounded-full animate-pulse delay-75" />
                <div className="h-1 w-1 bg-primary rounded-full animate-pulse delay-150" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStepIndex / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStepIndex / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}