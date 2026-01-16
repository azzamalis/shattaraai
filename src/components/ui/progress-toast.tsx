import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressToastProps {
  message: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export function ProgressToast({ message, progress, status }: ProgressToastProps) {
  const getIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-foreground animate-spin" />;
    }
  };

  return (
    <div className="min-w-[280px] flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className={cn(
          "text-sm font-medium",
          status === 'completed' && "text-green-500",
          status === 'failed' && "text-red-500",
          (status === 'pending' || status === 'processing') && "text-foreground"
        )}>
          {message} {status !== 'completed' && status !== 'failed' && `${Math.round(progress)}%`}
        </p>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className={cn(
            "h-full rounded-full",
            status === 'completed' && "bg-green-500",
            status === 'failed' && "bg-red-500",
            (status === 'pending' || status === 'processing') && "bg-foreground"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Step labels for user-friendly display
export const PROCESSING_STEPS: Record<string, { label: string; progress: number }> = {
  'pending': { label: 'Starting', progress: 0 },
  'uploading': { label: 'Uploading', progress: 10 },
  'extracting': { label: 'Extracting content', progress: 25 },
  'transcribing': { label: 'Transcribing audio', progress: 40 },
  'analyzing': { label: 'Analyzing', progress: 55 },
  'generating_chapters': { label: 'Generating chapters', progress: 70 },
  'enhancing': { label: 'AI enhancement', progress: 85 },
  'saving': { label: 'Saving', progress: 95 },
  'completed': { label: 'Complete!', progress: 100 },
  'failed': { label: 'Failed', progress: 0 },
};

export function getStepInfo(step: string | undefined, processingStatus: string): { label: string; progress: number } {
  // If we have a specific step, use it
  if (step && PROCESSING_STEPS[step]) {
    return PROCESSING_STEPS[step];
  }
  
  // Otherwise, fall back to processing status
  if (processingStatus === 'completed') {
    return PROCESSING_STEPS['completed'];
  }
  
  if (processingStatus === 'failed') {
    return PROCESSING_STEPS['failed'];
  }
  
  if (processingStatus === 'processing') {
    return { label: 'Processing', progress: 50 };
  }
  
  return PROCESSING_STEPS['pending'];
}
