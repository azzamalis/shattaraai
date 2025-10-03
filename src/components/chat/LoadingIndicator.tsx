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
        return message || 'Shattara AI is thinking';
      default:
        return message || 'Loading...';
    }
  };

  return (
    <Loader variant="loading-dots" text={getText()} />
  );
}