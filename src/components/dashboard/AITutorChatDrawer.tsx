import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Loader2, AlertCircle, Clock, User, Bot, GripVertical, SquarePen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { chatMessageStyles, formatTimestamp } from '@/lib/chatStyles';
import { useChatConversation } from '@/hooks/useChatConversation';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { useAIUsageTracking } from '@/hooks/useAIUsageTracking';
import { useWindowSize } from '@/hooks/use-window-size';
import RichMessage from '@/components/chat/RichMessage';

interface AITutorChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId?: string;
  roomContent?: Array<{
    id: string;
    title: string;
    type: string;
    text_content?: string;
  }>;
}

export function AITutorChatDrawer({
  open,
  onOpenChange,
  roomId,
  roomContent = []
}: AITutorChatDrawerProps) {
  const [input, setInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [panelWidth, setPanelWidth] = useState(() => {
    // Load saved width or default to 400px
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('aiChatDrawerWidth') || '400', 10);
    }
    return 400;
  });
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isMobile, width: windowWidth } = useWindowSize();
  const resizeRef = useRef<HTMLDivElement>(null);

  const { checkRateLimit, usageStats, planLimits } = useAIUsageTracking();

  // Initialize chat conversation for room collaboration
  const {
    conversation,
    messages: persistedMessages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse
  } = useChatConversation({
    conversationType: 'room_collaboration',
    contextId: roomId,
    contextType: 'room',
    autoCreate: true
  });

  // Local UI messages state
  const [messages, setMessages] = useState<typeof persistedMessages>([]);

  // Prepare conversation history for AI context (use persisted messages)
  const conversationHistory = persistedMessages.slice(-10).map(msg => ({
    content: msg.content,
    sender_type: msg.sender_type as 'user' | 'ai'
  }));

  // Initialize OpenAI chat hook
  const { sendMessageToAI } = useOpenAIChat({
    conversationId: conversation?.id || '',
    roomId: roomId || '',
    roomContent,
    conversationHistory
  });

  // Persist panel width
  const persistWidth = useCallback((newWidth: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiChatDrawerWidth', newWidth.toString());
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

  // Load persisted messages and show welcome when drawer opens
  useEffect(() => {
    if (open && conversation) {
      setRateLimitError(null);
      
      // Check usage when opening chat
      if (usageStats && planLimits) {
        const usagePercent = (usageStats.chatRequests / planLimits.dailyChatLimit) * 100;
        setIsNearLimit(usagePercent > 80);
      }
      
      // Load persisted messages from database
      if (persistedMessages.length > 0) {
        setMessages(persistedMessages);
        setWelcomeMessageSent(true);
      } else {
        // Add fresh welcome message only if no persisted messages
        const welcomeMessage = roomContent.length > 0
          ? `Hello! I'm Shattara AI Tutor. I can see you have ${roomContent.length} item(s) in this room. How can I help you learn today?`
          : "Hello! I'm Shattara AI Tutor. This room doesn't have any content yet. Feel free to add some study materials, and I'll help you learn from them!";
        
        const welcomeMsg = {
          id: `welcome-${Date.now()}`,
          content: welcomeMessage,
          sender_type: 'ai' as const,
          created_at: new Date().toISOString(),
          attachments: []
        };
        
        setMessages([welcomeMsg]);
        setWelcomeMessageSent(true);
      }
    }
  }, [open, conversation, persistedMessages, roomContent.length, usageStats, planLimits]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAITyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || !conversation) return;

    // Check rate limits before sending
    const rateLimitInfo = await checkRateLimit('chat');
    if (rateLimitInfo && !rateLimitInfo.allowed) {
      setRateLimitError(
        `Daily chat limit reached (${rateLimitInfo.planType} plan). Resets at ${new Date(rateLimitInfo.resetTime).toLocaleTimeString()}`
      );
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setRateLimitError(null);

    try {
      // Add user message to UI immediately
      const tempUserMsg = {
        id: `temp-user-${Date.now()}`,
        content: userMessage,
        sender_type: 'user' as const,
        created_at: new Date().toISOString(),
        attachments: []
      };
      setMessages(prev => [...prev, tempUserMsg]);

      // Send user message to database
      await sendMessage(userMessage);
      
      // Show AI typing indicator
      setIsAITyping(true);

      // Get AI response
      const aiResponse = await sendMessageToAI(userMessage);
      
      // Add AI response to database
      await addAIResponse(aiResponse, 'ai_response', {
        model: 'o4-mini-2025-04-16',
        room_id: roomId,
        responded_to: userMessage
      });

      // Add AI response to UI
      const aiMsg = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender_type: 'ai' as const,
        created_at: new Date().toISOString(),
        attachments: []
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error('Error handling message:', error);
    } finally {
      setIsAITyping(false);
    }
  };

  const handleNewChat = () => {
    // Clear local messages and reset welcome message state
    setMessages([]);
    setWelcomeMessageSent(false);
    setInput('');
    setRateLimitError(null);
    
    // Add fresh welcome message
    const welcomeMessage = roomContent.length > 0
      ? `Hello! I'm Shattara AI Tutor. I can see you have ${roomContent.length} item(s) in this room. How can I help you learn today?`
      : "Hello! I'm Shattara AI Tutor. This room doesn't have any content yet. Feel free to add some study materials, and I'll help you learn from them!";
    
    const welcomeMsg = {
      id: `welcome-${Date.now()}`,
      content: welcomeMessage,
      sender_type: 'ai' as const,
      created_at: new Date().toISOString(),
      attachments: []
    };
    
    setMessages([welcomeMsg]);
    setWelcomeMessageSent(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle keyboard resize
  const handleKeyboardResize = useCallback((e: React.KeyboardEvent) => {
    if (!open) return;
    
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
  }, [open, panelWidth, windowWidth, persistWidth]);

  // Add keyboard event listener
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyboardResize as any);
      return () => document.removeEventListener('keydown', handleKeyboardResize as any);
    }
  }, [open, handleKeyboardResize]);

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-end">
        <div 
          style={{ width: isMobile ? '100%' : panelWidth }}
          className="h-full bg-background border-l border-border flex items-center justify-center"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading chat...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-end">
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
          className="h-full bg-background border-l border-border flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
            <h3 className="text-lg font-semibold text-foreground truncate">Learn with Shattara AI Tutor</h3>
            <TooltipProvider>
              <div className="flex items-center gap-2 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleNewChat}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
                    >
                      <SquarePen className="h-4 w-4" />
                      <span className="sr-only">New Chat</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>New Chat</p>
                  </TooltipContent>
                </Tooltip>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onOpenChange(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </TooltipProvider>
          </div>
          
          {/* Usage Warning */}
          {isNearLimit && (
            <Alert className="mx-6 my-4 shrink-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm break-words">
                You're approaching your daily chat limit. 
                {usageStats && planLimits && (
                  <span className="ml-1">
                    {usageStats.chatRequests}/{planLimits.dailyChatLimit} requests used
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Rate Limit Error */}
          {rateLimitError && (
            <Alert variant="destructive" className="mx-6 my-4 shrink-0">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-sm break-words">{rateLimitError}</AlertDescription>
            </Alert>
          )}
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className={chatMessageStyles.container}>
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={chatMessageStyles.wrapper(message.sender_type === 'user')}
                >
                  {/* Message Label */}
                  <div className={message.sender_type === 'user' ? chatMessageStyles.userLabel : chatMessageStyles.aiLabel}>
                    {message.sender_type === 'user' ? (
                      <>
                        <User className="h-3 w-3" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3" />
                        <span>AI Tutor</span>
                      </>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="w-full">
                    <RichMessage content={message.content} className={chatMessageStyles.content} />
                    
                    {/* Timestamp and metadata */}
                    <div className={chatMessageStyles.timestamp}>
                      <span>{formatTimestamp(new Date(message.created_at))}</span>
                      {message.sender_type === 'ai' && (message as any).metadata?.cached && (
                        <Badge variant="outline" className="text-xs py-0 px-1 shrink-0">
                          Cached
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* AI Typing Indicator */}
              {isAITyping && (
                <div className={chatMessageStyles.wrapper(false)}>
                  <div className={chatMessageStyles.aiLabel}>
                    <Bot className="h-3 w-3" />
                    <span>AI Tutor</span>
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm text-muted-foreground">AI Tutor is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-6 border-t border-border bg-background shrink-0">
            <div className="flex gap-3">
              <Input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder="Ask about your study materials..." 
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-w-0 flex-1"
                disabled={isSending || isAITyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isSending || isAITyping || !conversation || !!rateLimitError} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm shrink-0"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            
            {/* Resize hint for keyboard users */}
            {!isMobile && (
              <div className="text-xs text-muted-foreground mt-2 text-center">
                Use Alt + ← → to resize, or drag the left border
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}