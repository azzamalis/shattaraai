import React from 'react';
import { Loader } from '@/components/ui/loader';

interface LoadingIndicatorProps {
  type: 'ai' | 'files';
  message?: string;
}

export function LoadingIndicator({ type, message }: LoadingIndicatorProps) {
  const defaultMessage = type === 'ai' ? 'Shattara AI is thinking...' : 'Processing files...';

  return (
    <div className="flex items-center justify-start px-4 py-3">
      <Loader variant="text-shimmer" text={message || defaultMessage} />
    </div>
  );
}