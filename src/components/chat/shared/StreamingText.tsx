import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StreamingTextProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

/**
 * StreamingText component displays text with a smooth typing cursor animation
 * when streaming is active. Uses CSS animations for performance.
 */
export const StreamingText = memo(function StreamingText({
  content,
  isStreaming = false,
  className
}: StreamingTextProps) {
  // Memoize the cursor element
  const cursor = useMemo(() => {
    if (!isStreaming) return null;
    
    return (
      <span 
        className="inline-block w-2 h-5 bg-primary/80 ml-0.5 animate-pulse rounded-sm align-middle"
        aria-hidden="true"
      />
    );
  }, [isStreaming]);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {content}
      {cursor}
    </span>
  );
});

/**
 * StreamingMarkdown wraps content with streaming indicator and smooth transitions
 */
interface StreamingMarkdownProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const StreamingContainer = memo(function StreamingContainer({
  content,
  isStreaming = false,
  className,
  children
}: StreamingMarkdownProps) {
  return (
    <div 
      className={cn(
        "relative transition-opacity duration-150",
        isStreaming && "animate-fade-in",
        className
      )}
    >
      {children}
      {isStreaming && content.length > 0 && (
        <span 
          className="inline-block w-1.5 h-4 bg-primary/70 ml-0.5 animate-pulse rounded-sm align-baseline"
          aria-label="AI is typing"
        />
      )}
    </div>
  );
});

/**
 * Typing indicator with animated dots
 */
export const TypingIndicator = memo(function TypingIndicator({ 
  className 
}: { 
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-1 py-2", className)}>
      <span 
        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '0.6s' }}
      />
      <span 
        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
        style={{ animationDelay: '150ms', animationDuration: '0.6s' }}
      />
      <span 
        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
        style={{ animationDelay: '300ms', animationDuration: '0.6s' }}
      />
    </div>
  );
});
