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
  timeoutMs = 60000  // Increased to 60 seconds for larger PDFs
}: PDFTimeoutHandlerProps) {
  useEffect(() => {
    if (!loading || !url) return;

    console.log(`PDFViewer: Starting ${timeoutMs}ms timeout for URL:`, url);
    
    const timeoutId = setTimeout(() => {
      console.error('PDFViewer: Loading timeout reached for URL:', url);
      console.error('PDFViewer: Timeout details:', {
        timeoutMs,
        startTime: Date.now() - timeoutMs,
        url: url.substring(0, 100) + (url.length > 100 ? '...' : '')
      });
      onTimeout();
    }, timeoutMs);

    return () => {
      console.log('PDFViewer: Clearing timeout for URL:', url);
      clearTimeout(timeoutId);
    };
  }, [loading, url, onTimeout, timeoutMs]);

  return null;
}