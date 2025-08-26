import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertCircle, ChevronDown, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingError {
  stage: string;
  code: string;
  message: string;
  details?: any;
  timestamp?: string;
}

interface ProcessingErrorBannerProps {
  error: ProcessingError;
  onRetry?: () => void;
  onDismiss?: () => void;
  isRetrying?: boolean;
}

export const ProcessingErrorBanner: React.FC<ProcessingErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss,
  isRetrying = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getErrorStageDescription = (stage: string) => {
    switch (stage) {
      case 'youtube_extraction':
        return 'YouTube audio extraction';
      case 'audio_download':
        return 'Audio file download';
      case 'video_download':
        return 'Video file download';
      case 'transcription':
        return 'Audio transcription';
      case 'database_update':
        return 'Database update';
      case 'chapter_generation':
        return 'Chapter generation';
      default:
        return 'Processing';
    }
  };

  const getErrorIcon = () => {
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <div className="flex items-start gap-3">
        {getErrorIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-sm">
              Processing failed at {getErrorStageDescription(error.stage)}
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <AlertDescription className="text-xs mb-3">
            {error.message}
          </AlertDescription>

          <div className="flex items-center gap-2 mb-2">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                disabled={isRetrying}
                className="h-7 px-3 text-xs"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry processing
                  </>
                )}
              </Button>
            )}

            {error.details && (
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-3 text-xs"
                  >
                    Details
                    <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isExpanded && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="bg-muted/50 rounded p-2 text-xs">
                    <div className="font-mono text-xs">
                      <div><strong>Code:</strong> {error.code}</div>
                      <div><strong>Stage:</strong> {error.stage}</div>
                      {error.timestamp && (
                        <div><strong>Time:</strong> {new Date(error.timestamp).toLocaleString()}</div>
                      )}
                      {error.details && (
                        <div className="mt-2">
                          <strong>Details:</strong>
                          <pre className="mt-1 text-xs whitespace-pre-wrap">
                            {JSON.stringify(error.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default ProcessingErrorBanner;