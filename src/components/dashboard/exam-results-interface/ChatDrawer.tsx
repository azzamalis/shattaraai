
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Copy, Trash2, ThumbsUp, ThumbsDown, Pencil, ArrowUp, Loader2, Square, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor } from '@/components/prompt-kit/chat-container';
import { Message, MessageAvatar, MessageContent, MessageActions, MessageAction } from '@/components/prompt-kit/message';
import { PromptInput, PromptInputTextarea, PromptInputActions, PromptInputAction } from '@/components/prompt-kit/prompt-input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/prompt-kit/markdown';
import { supabase } from '@/integrations/supabase/client';
import { useWindowSize } from '@/hooks/use-window-size';

interface ChatMessage {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered';
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestionId: number | null;
  examId?: string;
  contentId?: string;
  roomId?: string | null;
  chatType?: 'question' | 'space';
}

export function ChatDrawer({ isOpen, onClose, currentQuestionId, examId, contentId, roomId, chatType = 'question' }: ChatDrawerProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [panelWidth, setPanelWidth] = useState(() => {
    // Load saved width or default to 420px
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('examChatDrawerWidth') || '420', 10);
    }
    return 420;
  });
  const [isResizing, setIsResizing] = useState(false);
  const { isMobile, width: windowWidth } = useWindowSize();
  const resizeRef = useRef<HTMLDivElement>(null);

  // Persist panel width
  const persistWidth = useCallback((newWidth: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('examChatDrawerWidth', newWidth.toString());
    }
  }, []);

  // Handle resize
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = Math.max(320, Math.min(windowWidth * 0.8, windowWidth - e.clientX));
    setPanelWidth(newWidth);
    persistWidth(newWidth);
  }, [isResizing, windowWidth, persistWidth]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  // Handle keyboard resize
  const handleKeyboardResize = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowLeft' && e.altKey) {
      e.preventDefault();
      const newWidth = Math.max(320, panelWidth - 20);
      setPanelWidth(newWidth);
      persistWidth(newWidth);
    } else if (e.key === 'ArrowRight' && e.altKey) {
      e.preventDefault();
      const newWidth = Math.min(windowWidth * 0.8, panelWidth + 20);
      setPanelWidth(newWidth);
      persistWidth(newWidth);
    }
  }, [isOpen, panelWidth, windowWidth, persistWidth]);

  // Add keyboard event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyboardResize);
      return () => document.removeEventListener('keydown', handleKeyboardResize);
    }
  }, [isOpen, handleKeyboardResize]);

  // Get user name from Supabase
  useEffect(() => {
    const getUserName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name);
      } else if (session?.user?.email) {
        // Extract first name from email if no full name
        const firstName = session.user.email.split('@')[0];
        setUserName(firstName);
      } else {
        setUserName('Student');
      }
    };
    getUserName();
  }, []);

  // Load chat history from localStorage when opening chat
  useEffect(() => {
    if (isOpen) {
      const chatKey = chatType === 'question' && currentQuestionId && examId 
        ? `chat-history-${examId}-${currentQuestionId}`
        : `space-chat-history-${examId || roomId || 'default'}`;
      
      const savedMessages = localStorage.getItem(chatKey);
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        // Add appropriate welcome AI message
        let welcomeContent: string;
        if (chatType === 'question' && currentQuestionId) {
          welcomeContent = `You are asking me about Question ${currentQuestionId}, how can I help?`;
        } else {
          welcomeContent = `Hi ${userName}, I am Shattara AI tutor and I'm here to help you study!`;
        }
        
        const welcomeMessage: ChatMessage = {
          id: `welcome-${chatType}-${Date.now()}`,
          isUser: false,
          content: welcomeContent,
          timestamp: new Date(),
          status: 'delivered'
        };
        setChatMessages([welcomeMessage]);
      }
    }
  }, [isOpen, currentQuestionId, examId, chatType, roomId, userName]);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatMessages.length > 0) {
      const chatKey = chatType === 'question' && currentQuestionId && examId 
        ? `chat-history-${examId}-${currentQuestionId}`
        : `space-chat-history-${examId || roomId || 'default'}`;
      
      localStorage.setItem(chatKey, JSON.stringify(chatMessages));
    }
  }, [chatMessages, currentQuestionId, examId, chatType, roomId]);

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

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Message copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const handleEditMessage = (messageId: string) => {
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDeleteMessage = (messageId: string) => {
    setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success('Message deleted');
  };

  const handleUpvote = (messageId: string) => {
    // TODO: Implement upvote functionality
    toast.success('Thanks for the feedback!');
  };

  const handleDownvote = (messageId: string) => {
    // TODO: Implement downvote functionality
    toast.info('Thanks for the feedback!');
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
      
      {/* Resizable Chat Panel */}
      <div className="h-full flex">
        {/* Resize Handle */}
        {!isMobile && (
          <div
            ref={resizeRef}
            className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors relative group"
            onMouseDown={handleResizeStart}
            role="separator"
            aria-label="Resize chat panel"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const newWidth = Math.max(320, panelWidth - 20);
                setPanelWidth(newWidth);
                persistWidth(newWidth);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const newWidth = Math.min(windowWidth * 0.8, panelWidth + 20);
                setPanelWidth(newWidth);
                persistWidth(newWidth);
              }
            }}
          >
            <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Chat Content */}
        <div 
          style={{ 
            width: isMobile ? '100vw' : panelWidth,
            maxWidth: isMobile ? '100vw' : '80vw'
          }}
          className="bg-card shadow-xl flex flex-col"
        >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Exam Chat</h2>
          <button 
            onClick={onClose}
            className="rounded-md p-1 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Messages Area */}
        <ChatContainerRoot className="flex-1 px-4">
          <ChatContainerContent className="space-y-4 py-4">
            {chatMessages.map((message) => (
              <Message 
                key={message.id}
                className={cn(
                  "group",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <MessageContent
                    markdown={true}
                    className={cn(
                      "text-sm p-3",
                      message.isUser 
                        ? "bg-[#00A3FF] text-white rounded-2xl rounded-br-md" 
                        : "bg-muted/50 text-foreground rounded-2xl rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </MessageContent>
                  
                  <MessageActions className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {message.isUser ? (
                      <>
                        <MessageAction tooltip="Edit">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEditMessage(message.id)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Delete">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Copy">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </MessageAction>
                      </>
                    ) : (
                      <>
                        <MessageAction tooltip="Copy">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Upvote">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleUpvote(message.id)}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Downvote">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDownvote(message.id)}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </MessageAction>
                      </>
                    )}
                  </MessageActions>
                  
                  <span className="text-xs text-muted-foreground px-3">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </Message>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <Message className="justify-start">
                <div className="flex items-center gap-2 bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </Message>
            )}
            
            <ChatContainerScrollAnchor />
          </ChatContainerContent>
        </ChatContainerRoot>
        
        {/* Input Area */}
        <PromptInput
          value={chatInput}
          onValueChange={setChatInput}
          isLoading={isTyping}
          onSubmit={sendMessage}
          className="w-full border-t border-border p-4"
        >
          <PromptInputTextarea placeholder="Ask a question..." />
          <PromptInputActions className="justify-end pt-2">
            <PromptInputAction
              tooltip={isTyping ? "Stop generation" : "Send message"}
            >
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={sendMessage}
                disabled={!chatInput.trim() || !examId || isTyping}
              >
                {isTyping ? (
                  <Square className="size-5 fill-current" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
        </div>
      </div>
    </div>
  );
}
