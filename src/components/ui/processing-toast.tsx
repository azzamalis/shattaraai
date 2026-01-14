import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Youtube, 
  Globe, 
  Mic, 
  Video, 
  FileType,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type ContentType = 'pdf' | 'youtube' | 'website' | 'audio_file' | 'video' | 'text' | 'file' | 'live_recording' | 'chat' | 'upload';

interface ProcessingStep {
  key: string;
  label: string;
  progress: number;
}

const PROCESSING_STEPS: Record<ContentType, ProcessingStep[]> = {
  pdf: [
    { key: 'uploading', label: 'Uploading file...', progress: 10 },
    { key: 'extracting', label: 'Extracting text...', progress: 30 },
    { key: 'chunking', label: 'Chunking content...', progress: 50 },
    { key: 'analyzing', label: 'Analyzing with AI...', progress: 75 },
    { key: 'generating', label: 'Generating chapters...', progress: 90 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  youtube: [
    { key: 'uploading', label: 'Processing URL...', progress: 10 },
    { key: 'fetching', label: 'Fetching video data...', progress: 25 },
    { key: 'extracting', label: 'Extracting transcript...', progress: 50 },
    { key: 'analyzing', label: 'Analyzing content...', progress: 75 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  website: [
    { key: 'uploading', label: 'Processing URL...', progress: 10 },
    { key: 'fetching', label: 'Fetching page...', progress: 30 },
    { key: 'extracting', label: 'Extracting content...', progress: 50 },
    { key: 'analyzing', label: 'Analyzing with AI...', progress: 75 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  audio_file: [
    { key: 'uploading', label: 'Uploading audio...', progress: 10 },
    { key: 'transcribing', label: 'Transcribing audio...', progress: 40 },
    { key: 'chunking', label: 'Processing segments...', progress: 60 },
    { key: 'analyzing', label: 'Generating chapters...', progress: 80 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  video: [
    { key: 'uploading', label: 'Uploading video...', progress: 10 },
    { key: 'extracting', label: 'Extracting audio...', progress: 25 },
    { key: 'transcribing', label: 'Transcribing...', progress: 50 },
    { key: 'analyzing', label: 'Analyzing content...', progress: 75 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  text: [
    { key: 'uploading', label: 'Processing text...', progress: 20 },
    { key: 'chunking', label: 'Chunking content...', progress: 50 },
    { key: 'analyzing', label: 'Analyzing with AI...', progress: 75 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  file: [
    { key: 'uploading', label: 'Uploading file...', progress: 10 },
    { key: 'extracting', label: 'Extracting content...', progress: 40 },
    { key: 'analyzing', label: 'Analyzing with AI...', progress: 75 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  live_recording: [
    { key: 'recording', label: 'Recording...', progress: 50 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  chat: [
    { key: 'processing', label: 'Processing...', progress: 50 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
  upload: [
    { key: 'uploading', label: 'Uploading...', progress: 20 },
    { key: 'processing', label: 'Processing...', progress: 60 },
    { key: 'completed', label: 'Ready!', progress: 100 },
  ],
};

const CONTENT_TYPE_ICONS: Record<ContentType, React.ElementType> = {
  pdf: FileText,
  youtube: Youtube,
  website: Globe,
  audio_file: Mic,
  video: Video,
  text: FileType,
  file: FileText,
  live_recording: Mic,
  chat: FileType,
  upload: FileText,
};

function getProgressColor(progress: number): string {
  if (progress <= 25) return 'bg-[#DE1135]';
  if (progress <= 50) return 'bg-[#F6BC2F]';
  return 'bg-[#0E8345]';
}

interface ProcessingToastProps {
  contentId: string;
  title: string;
  contentType: ContentType;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export function ProcessingToast({ 
  contentId, 
  title, 
  contentType,
  onComplete,
  onError 
}: ProcessingToastProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<string>('uploading');
  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = PROCESSING_STEPS[contentType] || PROCESSING_STEPS.upload;
  const Icon = CONTENT_TYPE_ICONS[contentType] || FileText;

  // Get current step info
  const currentStepInfo = steps.find(s => s.key === currentStep) || steps[0];
  const stepLabel = currentStepInfo?.label || 'Processing...';

  useEffect(() => {
    // Fetch initial status
    const fetchInitialStatus = async () => {
      const { data } = await supabase
        .from('content')
        .select('processing_status, metadata')
        .eq('id', contentId)
        .single();

      if (data) {
        const metadata = data.metadata as Record<string, unknown> | null;
        const step = metadata?.processingStep as string || 'uploading';
        const prog = metadata?.processingProgress as number || 10;
        
        setCurrentStep(step);
        setProgress(prog);
        
        if (data.processing_status === 'completed') {
          setStatus('completed');
          setProgress(100);
          onComplete?.();
        } else if (data.processing_status === 'failed') {
          setStatus('failed');
          setErrorMessage(metadata?.error as string || 'Processing failed');
          onError?.(metadata?.error as string || 'Processing failed');
        }
      }
    };

    fetchInitialStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`processing:${contentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'content',
          filter: `id=eq.${contentId}`
        },
        (payload) => {
          const newStatus = payload.new.processing_status as string;
          const metadata = payload.new.metadata as Record<string, unknown> | null;

          if (metadata?.processingStep) {
            setCurrentStep(metadata.processingStep as string);
          }
          if (metadata?.processingProgress) {
            setProgress(metadata.processingProgress as number);
          }

          if (newStatus === 'completed') {
            setStatus('completed');
            setProgress(100);
            setCurrentStep('completed');
            onComplete?.();
          } else if (newStatus === 'failed') {
            setStatus('failed');
            setErrorMessage(metadata?.error as string || 'Processing failed');
            onError?.(metadata?.error as string || 'Processing failed');
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [contentId, onComplete, onError]);

  const handleViewClick = () => {
    navigate(`/content/${contentId}`);
  };

  // Truncate title if too long
  const displayTitle = title.length > 35 ? title.slice(0, 32) + '...' : title;

  return (
    <div className="w-[360px] bg-card border border-border rounded-xl p-4 shadow-lg">
      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          status === 'completed' ? 'bg-[#0E8345]/20' : 
          status === 'failed' ? 'bg-destructive/20' : 
          'bg-primary/20'
        )}>
          {status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-[#0E8345]" />
          ) : status === 'failed' ? (
            <AlertCircle className="w-4 h-4 text-destructive" />
          ) : (
            <Icon className="w-4 h-4 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {displayTitle}
          </p>
          <p className="text-xs text-muted-foreground">
            {contentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/50">
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out",
              status === 'failed' ? 'bg-destructive' : getProgressColor(progress)
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status text and action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'processing' && (
            <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
          )}
          <p className={cn(
            "text-xs",
            status === 'completed' ? 'text-[#0E8345]' :
            status === 'failed' ? 'text-destructive' :
            'text-muted-foreground'
          )}>
            {status === 'failed' ? (errorMessage || 'Failed') : 
             status === 'completed' ? 'Ready!' : stepLabel}
          </p>
          {status === 'processing' && (
            <span className="text-xs text-muted-foreground">{progress}%</span>
          )}
        </div>
        
        {status === 'completed' && (
          <button
            onClick={handleViewClick}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProcessingToast;
