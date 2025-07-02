import React, { useState } from 'react';
import { Message } from '@/lib/types';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface ChatMessagesProps {
  messages: Message[];
}
export function ChatMessages({
  messages
}: ChatMessagesProps) {
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
  if (messages.length === 1) {
    // Show empty state for initial AI greeting
    return <div className="flex flex-col items-center justify-center h-full p-8">
        
        <h3 className="text-dashboard-text dark:text-dashboard-text mb-2 text-lg font-medium">
          Learn with the Shattara AI Tutor
        </h3>
        <p className="text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 text-center max-w-md text-sm">
          Start a conversation to get help with any topic, generate quizzes, create flashcards, and more.
        </p>
      </div>;
  }
  return <div className="space-y-4 p-4">
      {messages.map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={cn("group relative max-w-[80%] rounded-lg px-4 py-3", message.sender === 'user' ? "bg-[#00A3FF] text-white" : "bg-dashboard-card dark:bg-dashboard-card text-dashboard-text dark:text-dashboard-text")}>
            <p className="text-sm">{message.content}</p>
            
            {message.copyable && <button onClick={() => copyToClipboard(message.content, message.id)} className={cn("absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded", "hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover")} title="Copy message">
                {copiedId === message.id ? <Check className="h-3 w-3 text-[#00A3FF]" /> : <Copy className="h-3 w-3 text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70" />}
              </button>}
            
            <div className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60 mt-1">
              {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
            </div>
          </div>
        </div>)}
    </div>;
}