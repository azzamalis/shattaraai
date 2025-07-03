
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/hooks/useChatConversation';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  isSending?: boolean;
  emptyStateContent?: React.ReactNode;
  className?: string;
  showTimestamps?: boolean;
  inputPlaceholder?: string;
}

export function ChatContainer({
  messages,
  onSendMessage,
  isLoading = false,
  isSending = false,
  emptyStateContent,
  className,
  showTimestamps = true,
  inputPlaceholder = "Type your message..."
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="flex items-center gap-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading conversation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {messages.length === 0 && emptyStateContent ? (
            <div className="flex items-center justify-center h-full p-8">
              {emptyStateContent}
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  showTimestamp={showTimestamps}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-dashboard-separator/20 dark:border-white/10 p-4 bg-dashboard-bg dark:bg-dashboard-bg">
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isSending}
          placeholder={inputPlaceholder}
        />
      </div>
    </div>
  );
}
