
import React, { useState } from 'react';
import { Message } from '@/lib/types';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
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
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Learn with the Shattara AI Tutor
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          Start a conversation to get help with any topic, generate quizzes, create flashcards, and more.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
              group relative max-w-[80%] rounded-lg px-4 py-3
              ${message.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-transparent border border-border'
              }
            `}
          >
            <p className="text-sm">{message.content}</p>
            
            {message.copyable && (
              <button
                onClick={() => copyToClipboard(message.content, message.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent"
                title="Copy message"
              >
                {copiedId === message.id ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            )}
            
            <div className="text-xs opacity-60 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
