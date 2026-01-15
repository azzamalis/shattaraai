import React, { useState } from 'react';
import { Copy, Check, Paperclip, ThumbsUp, ThumbsDown, Pen, MoreVertical, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ChatMessage, MessageStatus } from '@/hooks/useChatConversation';
import { RichMessage } from '../RichMessage';
import { Button } from '@/components/ui/button';

interface PromptKitMessageProps {
  message: ChatMessage;
  showTimestamp?: boolean;
  onRetry?: (messageId: string) => void;
}

export function PromptKitMessage({
  message,
  showTimestamp = false,
  onRetry
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
  const isSending = message.status === 'sending';
  const isFailed = message.status === 'failed';

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

  // User messages - right aligned with rounded bubble
  if (isUser) {
    return (
      <div className="flex flex-col gap-2">
        {/* File Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex justify-end">
            <div className="flex flex-wrap gap-2 justify-end max-w-[80%]">
              {message.attachments.map((attachment, index) => (
                <div
                  key={`${attachment.name}-${index}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border",
                    "bg-primary/10 border-primary/20 text-primary",
                    "hover:bg-primary/20 transition-colors cursor-pointer"
                  )}
                >
                  <div className="p-1 rounded bg-primary/20">
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
          </div>
        )}

        {/* User Message Bubble */}
        <div className="flex w-full justify-end">
          <div className="group/message flex w-full flex-col items-end gap-1">
            <div className="flex w-full justify-end">
              <div
                className={cn(
                  "relative w-fit rounded-3xl p-3 text-left leading-relaxed",
                  "text-primary/95 border border-primary/5 bg-primary/5 dark:bg-neutral-800",
                  isSending && "opacity-70",
                  isFailed && "bg-destructive/10 border-destructive/20"
                )}
              >
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-base leading-7 last:mb-0 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            {(isSending || isFailed) && (
              <div className="flex items-center gap-2 mt-1">
                {isSending && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Sending...</span>
                  </div>
                )}
                {isFailed && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <span>Failed to send</span>
                    </div>
                    {onRetry && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRetry(message.id)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Edit Action - shown on hover */}
            {!isSending && !isFailed && (
              <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover/message:opacity-100">
                <button
                  className="rounded-full p-1 transition-colors hover:bg-primary/10"
                  aria-label="Edit message"
                >
                  <Pen className="h-3 w-3 text-primary/60" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AI messages - left aligned, transparent background
  return (
    <div className="overflow-x-auto">
      <div className="flex w-full flex-col">
        <div className="w-full">
          <div className="flex w-full justify-start">
            <div className="w-full" style={{ position: 'relative' }}>
              <div className="relative rounded-3xl text-left leading-relaxed text-primary/95 w-full group bg-transparent p-0 pt-1">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <RichMessage 
                    content={message.content}
                    className="text-primary/95"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Message Actions */}
        {!isSending && !isFailed && (
          <div className="py-3">
            <div className="flex flex-row items-center justify-between space-x-1">
              <div className="flex flex-row items-center space-x-1">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-1.5 text-muted-foreground"
                  onClick={() => copyToClipboard(message.content, message.id)}
                >
                  {copiedId === message.id ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-1.5 text-muted-foreground"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-1.5 text-muted-foreground"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-1.5 text-muted-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
