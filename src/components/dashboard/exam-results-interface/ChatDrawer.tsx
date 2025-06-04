import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Copy, Trash2, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { chatMessageStyles } from '@/lib/chatStyles';

interface ChatMessage {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered';
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestionId: number | null;
}

export function ChatDrawer({ isOpen, onClose, currentQuestionId }: ChatDrawerProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage when opening chat
  useEffect(() => {
    if (isOpen && currentQuestionId) {
      const savedMessages = localStorage.getItem(`chat-history-${currentQuestionId}`);
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        setChatMessages([{
          id: Date.now().toString(),
          isUser: false,
          content: `I'm here to help you understand question ${currentQuestionId}. What would you like to know?`,
          timestamp: new Date(),
          status: 'delivered'
        }]);
      }
    }
  }, [isOpen, currentQuestionId]);

  // Save chat history to localStorage
  useEffect(() => {
    if (currentQuestionId) {
      localStorage.setItem(
        `chat-history-${currentQuestionId}`,
        JSON.stringify(chatMessages)
      );
    }
  }, [chatMessages, currentQuestionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isUser: true,
      content: chatInput,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Simulate message delivery
    setTimeout(() => {
      setChatMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'delivered' }
          : msg
      ));
    }, 500);

    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: 'This is a simulated AI tutor response. In a real implementation, this would connect to your AI service.',
        timestamp: new Date(),
        status: 'delivered'
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const deleteMessage = (messageId: string) => {
    setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success('Message deleted');
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="flex-1 bg-black/50" 
        onClick={onClose}
      />
      <div className="w-[420px] bg-card shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Space Chat</h2>
          <button 
            onClick={onClose}
            className="rounded-md p-1 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Messages Area - Added overflow-x-hidden to prevent horizontal scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
          {chatMessages.map((message) => (
            <div 
              key={message.id} 
              className={chatMessageStyles.wrapper(message.isUser)}
            >
              <div className={chatMessageStyles.bubble(message.isUser)}>
                <p className={chatMessageStyles.content}>{message.content}</p>
                <div className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60 mt-1">
                  {formatTimestamp(message.timestamp)}
                  {message.isUser && (
                    <span className="flex items-center ml-2">
                      {message.status === 'sending' && <Clock className="h-3 w-3" />}
                      {message.status === 'sent' && <Check className="h-3 w-3" />}
                      {message.status === 'delivered' && <Check className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-accent text-foreground rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatMessagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
            <button 
              onClick={sendMessage}
              disabled={!chatInput.trim()}
              className="rounded-lg bg-primary px-3 py-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
