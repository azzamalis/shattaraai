import React, { useState } from 'react';
import { Copy, Check, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/hooks/useChatConversation';
import { Message, MessageAvatar } from '@/components/prompt-kit/message';
import { RichMessage } from '../RichMessage';
import { Button } from '@/components/ui/button';

interface PromptKitMessageProps {
  message: ChatMessage;
  showTimestamp?: boolean;
}

export function PromptKitMessage({
  message,
  showTimestamp = true
}: PromptKitMessageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isUser = message.sender_type === 'user';
  const isSystem = message.sender_type === 'system';

  // System messages - simple centered display
  if (isSystem) {
    return (
      <div className="flex justify-center p-4">
        <div className="bg-secondary/10 text-secondary-foreground text-sm rounded-full px-4 py-2">
          {message.content}
        </div>
      </div>
    );
  }

  // User and AI messages using Prompt-Kit Message
  return (
    <Message className={cn(
      "px-4 py-2",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <MessageAvatar
        src={isUser ? "" : "/lovable-uploads/shattara-ai-avatar.png"}
        alt={isUser ? "User" : "Shattara AI"}
        fallback={isUser ? "U" : "AI"}
        className={cn(
          "h-8 w-8",
          isUser && "bg-[#00A3FF] text-white"
        )}
      />

      {/* Content Container */}
      <div className={cn(
        "flex flex-col gap-2 max-w-[80%]",
        isUser && "items-end"
      )}>
        {/* File Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={`${attachment.id || index}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border",
                  "bg-[#00A3FF]/10 border-[#00A3FF]/20 text-[#00A3FF]",
                  "hover:bg-[#00A3FF]/20 transition-colors cursor-pointer"
                )}
              >
                <div className="p-1 rounded bg-[#00A3FF]/20">
                  <Paperclip className="h-3 w-3" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate max-w-40 font-medium text-xs">
                    {attachment.name}
                  </span>
                  {attachment.size && (
                    <span className="text-xs opacity-70">
                      {formatFileSize(attachment.size)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Bubble */}
        <div className="relative group">
          <div
            className={cn(
              "rounded-lg px-4 py-3",
              isUser && "bg-[#00A3FF] text-white",
              !isUser && "bg-card text-card-foreground border border-border"
            )}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            ) : (
              <RichMessage 
                content={message.content}
                className="text-card-foreground"
              />
            )}
          </div>

          {/* Copy Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(message.content, message.id)}
            className={cn(
              "absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-secondary/20"
            )}
            title="Copy message"
          >
            {copiedId === message.id ? (
              <Check className="h-3 w-3 text-[#00A3FF]" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Timestamp */}
        {showTimestamp && (
          <div className={cn(
            "text-xs text-muted-foreground px-1",
            isUser && "text-right"
          )}>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </Message>
  );
}
