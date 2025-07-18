
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/hooks/useChatConversation';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, attachments?: File[]) => void;
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

  const handleSendMessage = (content: string, attachments?: File[]) => {
    // For now, we'll just pass the content. File handling can be implemented later
    // when the backend is ready to process attachments
    onSendMessage(content, attachments);
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground">
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
      <div className="border-t border-border dark:border-border p-4 bg-background dark:bg-background">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isSending}
          placeholder={inputPlaceholder}
        />
      </div>
    </div>
  );
}
