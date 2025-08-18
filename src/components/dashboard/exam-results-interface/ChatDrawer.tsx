
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Copy, Trash2, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { chatMessageStyles } from '@/lib/chatStyles';
import { supabase } from '@/integrations/supabase/client';

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
  examId?: string;
  contentId?: string;
  roomId?: string | null;
}

export function ChatDrawer({ isOpen, onClose, currentQuestionId, examId, contentId, roomId }: ChatDrawerProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage when opening chat
  useEffect(() => {
    if (isOpen && currentQuestionId && examId) {
      const savedMessages = localStorage.getItem(`chat-history-${examId}-${currentQuestionId}`);
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        // Start with empty chat - no static messages
        setChatMessages([]);
      }
    }
  }, [isOpen, currentQuestionId, examId]);

  // Save chat history to localStorage
  useEffect(() => {
    if (currentQuestionId && examId) {
      localStorage.setItem(
        `chat-history-${examId}-${currentQuestionId}`,
        JSON.stringify(chatMessages)
      );
    }
  }, [chatMessages, currentQuestionId, examId]);

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
    if (!chatInput.trim() || !examId) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isUser: true,
      content: chatInput,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = chatInput;
    setChatInput('');
    
    // Update message status to delivered
    setTimeout(() => {
      setChatMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'delivered' }
          : msg
      ));
    }, 500);

    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Prepare conversation history
      const conversationHistory = chatMessages.map(msg => ({
        content: msg.content,
        sender_type: msg.isUser ? 'user' : 'ai'
      }));

      // Call the exam chat AI function
      const { data, error } = await supabase.functions.invoke('openai-exam-chat', {
        body: {
          message: currentMessage,
          examId,
          questionId: currentQuestionId,
          contentId,
          roomId,
          conversationHistory
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error calling exam chat function:', error);
        throw new Error('Failed to get AI response');
      }

      if (!data.success) {
        throw new Error(data.error || 'AI service error');
      }

      setIsTyping(false);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: data.response,
        timestamp: new Date(),
        status: 'delivered'
      };
      setChatMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setIsTyping(false);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: `I'm having trouble accessing the AI service right now. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        status: 'delivered'
      };
      setChatMessages(prev => [...prev, errorMessage]);
      
      toast.error('Failed to get AI response. Please try again.');
    }
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
              <div className="w-full">
                <p className={chatMessageStyles.content}>{message.content}</p>
                <div className={chatMessageStyles.timestamp}>
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
              disabled={!chatInput.trim() || !examId}
              className="rounded-lg bg-primary px-3 py-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
