import React, { useCallback, useRef, useEffect, memo } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { cn } from '@/lib/utils';

interface VirtualizedMessageListProps<T> {
  messages: T[];
  renderMessage: (message: T, index: number) => React.ReactNode;
  className?: string;
  /**
   * Threshold for enabling virtualization. 
   * Below this count, regular rendering is used for simplicity.
   * Default: 30 messages
   */
  virtualizationThreshold?: number;
  /**
   * Whether to auto-scroll to bottom on new messages
   * Default: true
   */
  autoScrollToBottom?: boolean;
  /**
   * Additional content to render at the bottom (e.g., typing indicator)
   */
  footerContent?: React.ReactNode;
  /**
   * Content to show when there are no messages
   */
  emptyContent?: React.ReactNode;
}

function VirtualizedMessageListInner<T extends { id: string }>({
  messages,
  renderMessage,
  className,
  virtualizationThreshold = 30,
  autoScrollToBottom = true,
  footerContent,
  emptyContent,
}: VirtualizedMessageListProps<T>) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const isAtBottomRef = useRef(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScrollToBottom && isAtBottomRef.current && virtuosoRef.current && messages.length > 0) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'smooth',
        align: 'end',
      });
    }
  }, [messages.length, autoScrollToBottom]);

  // Track scroll position to determine if we're at bottom
  const handleAtBottomStateChange = useCallback((atBottom: boolean) => {
    isAtBottomRef.current = atBottom;
  }, []);

  // Scroll to bottom immediately
  const scrollToBottom = useCallback(() => {
    if (virtuosoRef.current && messages.length > 0) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'smooth',
        align: 'end',
      });
    }
  }, [messages.length]);

  // If no messages, show empty content
  if (messages.length === 0 && emptyContent) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", className)}>
        {emptyContent}
      </div>
    );
  }

  // Use regular rendering for small message counts (better performance for small lists)
  if (messages.length < virtualizationThreshold) {
    return (
      <div className={cn("flex-1 overflow-y-auto", className)}>
        <div className="space-y-4 py-4">
          {messages.map((message, index) => (
            <div key={message.id}>
              {renderMessage(message, index)}
            </div>
          ))}
          {footerContent}
        </div>
      </div>
    );
  }

  // Use virtualization for larger message counts
  return (
    <Virtuoso
      ref={virtuosoRef}
      className={cn("flex-1", className)}
      data={messages}
      atBottomStateChange={handleAtBottomStateChange}
      atBottomThreshold={100}
      followOutput="smooth"
      initialTopMostItemIndex={messages.length - 1}
      itemContent={(index, message) => (
        <div className="py-2">
          {renderMessage(message, index)}
        </div>
      )}
      components={{
        Footer: () => footerContent ? <div className="py-2">{footerContent}</div> : null,
      }}
    />
  );
}

// Memoize the component to prevent unnecessary re-renders
export const VirtualizedMessageList = memo(VirtualizedMessageListInner) as typeof VirtualizedMessageListInner;

// Export scroll utility hook for external control
export function useVirtualizedScrollControl() {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const scrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({
      index: 'LAST',
      behavior: 'smooth',
      align: 'end',
    });
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    virtuosoRef.current?.scrollToIndex({
      index,
      behavior: 'smooth',
      align: 'start',
    });
  }, []);

  return { virtuosoRef, scrollToBottom, scrollToIndex };
}
