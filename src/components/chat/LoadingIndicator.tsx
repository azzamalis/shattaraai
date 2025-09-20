import React from 'react';
import { Loader2, FileText, Brain } from 'lucide-react';

interface LoadingIndicatorProps {
  type: 'files' | 'ai' | 'general';
  message?: string;
}

export function LoadingIndicator({ type, message }: LoadingIndicatorProps) {
  const getContent = () => {
    switch (type) {
      case 'files':
        return {
          icon: <FileText className="h-4 w-4 animate-pulse" />,
          text: message || 'Processing files...'
        };
      case 'ai':
        return {
          icon: <Brain className="h-4 w-4 animate-pulse" />,
          text: message || 'AI is thinking...'
        };
      default:
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: message || 'Loading...'
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-lg border border-border/50">
      {content.icon}
      <span className="text-sm text-muted-foreground animate-pulse">
        {content.text}
      </span>
    </div>
  );
}