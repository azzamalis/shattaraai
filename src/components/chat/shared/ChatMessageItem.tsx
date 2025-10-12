
import React, { useState } from 'react';
import { Copy, Check, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/hooks/useChatConversation';
import { RichMessage } from '../RichMessage';

interface ChatMessageItemProps {
  message: ChatMessage;
  showTimestamp?: boolean;
}

export function ChatMessageItem({
  message,
  showTimestamp = true
}: ChatMessageItemProps) {
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

  // Log for debugging
  console.log('ChatMessageItem - Rendering message:', message.id, 'attachments:', message.attachments);

  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser && "flex-row-reverse",
      isSystem && "justify-center"
    )}>
      {/* Message Content */}
      <div className={cn(
        "group relative max-w-[80%]",
        isSystem && "bg-dashboard-separator/10 dark:bg-white/5 text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm rounded-full px-4 py-2"
      )}>
        {/* File Attachments - Show above message content for user messages */}
        {message.attachments && message.attachments.length > 0 && !isSystem && isUser && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={`${attachment.name}-${index}`}
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

        {/* Main message bubble */}
        {!isSystem && (
          <div className={cn(
            "rounded-lg px-4 py-3 relative",
            isUser && "bg-[#00A3FF] text-white",
            !isUser && "bg-dashboard-card dark:bg-dashboard-card text-dashboard-text dark:text-dashboard-text border border-dashboard-separator/20 dark:border-white/10"
          )}>
            <div className={cn(
              "whitespace-pre-wrap break-words",
              isUser && "text-white",
              !isUser && "text-dashboard-text dark:text-dashboard-text"
            )}>
              {isUser ? (
                message.content
              ) : (
                <RichMessage 
                  content={message.content}
                  className="text-dashboard-text dark:text-dashboard-text"
                />
              )}
            </div>

            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(message.content, message.id)}
              className={cn(
                "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded",
                "hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover"
              )}
              title="Copy message"
            >
              {copiedId === message.id ? (
                <Check className="h-3 w-3 text-[#00A3FF]" />
              ) : (
                <Copy className="h-3 w-3 text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70" />
              )}
            </button>

            {/* Timestamp */}
            {showTimestamp && (
              <div className={cn(
                "text-xs mt-2",
                isUser 
                  ? "text-white/70" 
                  : "text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60"
              )}>
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        )}

        {/* System message content */}
        {isSystem && (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}
