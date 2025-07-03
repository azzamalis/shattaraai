
import React, { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/hooks/useChatConversation';

interface ChatMessageItemProps {
  message: ChatMessage;
  showTimestamp?: boolean;
}

export function ChatMessageItem({ message, showTimestamp = true }: ChatMessageItemProps) {
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

  const isUser = message.sender_type === 'user';
  const isSystem = message.sender_type === 'system';

  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser && "flex-row-reverse",
      isSystem && "justify-center"
    )}>
      {/* Avatar */}
      {!isSystem && (
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-[#00A3FF] text-white" 
            : "bg-dashboard-card dark:bg-dashboard-card border border-dashboard-separator/20 dark:border-white/10"
        )}>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "group relative max-w-[80%] rounded-lg px-4 py-3",
        isUser && "bg-[#00A3FF] text-white",
        !isUser && !isSystem && "bg-dashboard-card dark:bg-dashboard-card text-dashboard-text dark:text-dashboard-text border border-dashboard-separator/20 dark:border-white/10",
        isSystem && "bg-dashboard-separator/10 dark:bg-white/5 text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm rounded-full px-4 py-2"
      )}>
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Copy Button */}
        {!isSystem && (
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
        )}

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
    </div>
  );
}
