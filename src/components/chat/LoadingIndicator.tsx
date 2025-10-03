import React from 'react';
import { Loader } from '@/components/prompt-kit/loader';

interface LoadingIndicatorProps {
  type: 'files' | 'ai' | 'general';
  message?: string;
}

export function LoadingIndicator({ type, message }: LoadingIndicatorProps) {
  const getText = () => {
    switch (type) {
      case 'files':
        return message || 'Processing and uploading attachments...';
      case 'ai':
        return message || 'AI is analyzing your message...';
      default:
        return message || 'Loading...';
    }
  };

  return (
    <div className="flex items-center px-4 py-3 bg-card rounded-lg border border-border/50">
      <Loader variant="loading-dots" text={getText()} />
    </div>
  );
}