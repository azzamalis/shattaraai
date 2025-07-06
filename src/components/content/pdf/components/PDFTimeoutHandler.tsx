import React, { useEffect } from 'react';

interface PDFTimeoutHandlerProps {
  loading: boolean;
  url?: string;
  onTimeout: () => void;
  timeoutMs?: number;
}

export function PDFTimeoutHandler({ 
  loading, 
  url, 
  onTimeout, 
  timeoutMs = 60000  // Increased to 60 seconds
}: PDFTimeoutHandlerProps) {
  useEffect(() => {
    if (!loading || !url) return;

    const timeoutId = setTimeout(() => {
      console.error('PDFViewer: Loading timeout reached for URL:', url);
      onTimeout();
    }, timeoutMs);

    return () => clearTimeout(timeoutId);
  }, [loading, url, onTimeout, timeoutMs]);

  return null;
}