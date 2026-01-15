import React from 'react';
import { PromptKitMessage } from './PromptKitMessage';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/hooks/useChatConversation';
import { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor } from '@/components/prompt-kit/chat-container';
import { EnhancedPromptInput } from '@/components/ui/enhanced-prompt-input';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  isSending?: boolean;
  streamingMessageId?: string | null;
  emptyStateContent?: React.ReactNode;
  className?: string;
  showTimestamps?: boolean;
  inputPlaceholder?: string;
  loadingContent?: React.ReactNode;
}

export function ChatContainer({
  messages,
  onSendMessage,
  isLoading = false,
  isSending = false,
  streamingMessageId = null,
  emptyStateContent,
  className,
  showTimestamps = false,
  inputPlaceholder = "Learn anything",
  loadingContent
}: ChatContainerProps) {
  const handleSendMessage = (content: string, attachments?: File[]) => {
    console.log('ChatContainer - Sending message with attachments:', attachments);
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
      {/* Messages Area - Centered max-width container */}
      <ChatContainerRoot className="flex-1 overflow-y-auto">
        <ChatContainerContent className="mx-auto flex w-full max-w-3xl flex-grow flex-col px-4 sm:px-4 mt-0 justify-start">
          {messages.length === 0 && emptyStateContent ? (
            <div className="flex items-center justify-center h-full p-8">
              {emptyStateContent}
            </div>
          ) : (
            <div className="w-full">
              <div className="space-y-8">
                {messages.map((message) => {
                  const isStreaming = message.id === streamingMessageId;
                  console.log('ChatContainer - Rendering message:', message.id, 'with attachments:', message.attachments, 'isStreaming:', isStreaming);
                  return (
                    <PromptKitMessage
                      key={message.id}
                      message={message}
                      showTimestamp={showTimestamps}
                      isStreaming={isStreaming}
                    />
                  );
                })}
                
                {/* Loading indicators in chat area */}
                {loadingContent && (
                  <div className="py-2">
                    {loadingContent}
                  </div>
                )}
              </div>
            </div>
          )}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      {/* Input Area - Enhanced Prompt Input */}
      <div className="relative px-4 pb-4 bg-background">
        <div className="mx-auto max-w-3xl">
          <EnhancedPromptInput
            onSubmit={handleSendMessage}
            className="border-border bg-card relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
