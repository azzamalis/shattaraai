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
  emptyStateContent,
  className,
  showTimestamps = true,
  inputPlaceholder = "Ask Shattara AI anything",
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
      {/* Messages Area - Prompt-Kit ChatContainer */}
      <ChatContainerRoot className="flex-1 overflow-y-auto">
        <ChatContainerContent className="space-y-1">
          {messages.length === 0 && emptyStateContent ? (
            <div className="flex items-center justify-center h-full p-8">
              {emptyStateContent}
            </div>
          ) : (
            <>
              {messages.map((message) => {
                console.log('ChatContainer - Rendering message:', message.id, 'with attachments:', message.attachments);
                return (
                  <PromptKitMessage
                    key={message.id}
                    message={message}
                    showTimestamp={showTimestamps}
                  />
                );
              })}
              
              {/* Loading indicators in chat area */}
              {loadingContent && (
                <div className="px-4 py-2">
                  {loadingContent}
                </div>
              )}
            </>
          )}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      {/* Input Area - Enhanced Prompt Input */}
      <div className="relative px-4 pb-4 bg-background">
        <EnhancedPromptInput
          onSubmit={handleSendMessage}
          className="border-border bg-card relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-sm"
        />
      </div>
    </div>
  );
}
