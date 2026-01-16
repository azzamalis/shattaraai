import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressToastProps {
  message: string;
  progress: number;
  status: "pending" | "processing" | "completed" | "failed";
}

export function ProgressToast({ message, progress, status }: ProgressToastProps) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />;
      default:
        return <Loader2 className="h-4 w-4 text-slate-600 flex-shrink-0 animate-spin" />;
    }
  };

  return (
    <div className="min-w-[360px] max-w-[420px] bg-white rounded-2xl shadow-lg border border-slate-200/60 p-5">
      <div className="flex items-start gap-3 mb-4">
  <div className="mt-0.5">
    {getIcon()}
  </div>
  <div className="flex-1 min-w-0">
    <p className={cn(
      "text-sm font-medium leading-relaxed",
      status === 'completed' && "text-slate-900",
      status === 'failed' && "text-slate-900",
      (status === 'pending' || status === 'processing') && "text-slate-700"
    )}>
      {message}
    </p>
  </div>
</div>
<div className="flex items-center gap-3">
  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
    {/* progress bar */}
  </div>
  {status !== 'completed' && status !== 'failed' && (
    <p className="text-xs text-slate-500 font-medium min-w-[38px] text-right">
      {Math.round(progress)}%
    </p>
  )}
</div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            status === "completed" && "bg-green-600",
            status === "failed" && "bg-red-600",
            (status === "pending" || status === "processing") && "bg-slate-900",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Step labels for user-friendly display
export const PROCESSING_STEPS: Record<string, { label: string; progress: number }> = {
  pending: { label: "Starting", progress: 0 },
  uploading: { label: "Uploading", progress: 10 },
  extracting: { label: "Extracting content", progress: 25 },
  transcribing: { label: "Transcribing audio", progress: 40 },
  analyzing: { label: "Analyzing", progress: 55 },
  generating_chapters: { label: "Generating chapters", progress: 70 },
  enhancing: { label: "AI enhancement", progress: 85 },
  saving: { label: "Saving", progress: 95 },
  completed: { label: "Complete!", progress: 100 },
  failed: { label: "Failed", progress: 0 },
};

export function getStepInfo(step: string | undefined, processingStatus: string): { label: string; progress: number } {
  // If we have a specific step, use it
  if (step && PROCESSING_STEPS[step]) {
    return PROCESSING_STEPS[step];
  }

  // Otherwise, fall back to processing status
  if (processingStatus === "completed") {
    return PROCESSING_STEPS["completed"];
  }

  if (processingStatus === "failed") {
    return PROCESSING_STEPS["failed"];
  }

  if (processingStatus === "processing") {
    return { label: "Processing", progress: 50 };
  }

  return PROCESSING_STEPS["pending"];
}
