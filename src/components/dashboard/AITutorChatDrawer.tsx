import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { X, Loader2, AlertCircle, Clock, GripVertical, SquarePen, Copy, ThumbsUp, ThumbsDown, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message";
import { EnhancedPromptInput } from '@/components/ui/enhanced-prompt-input';
import { cn } from "@/lib/utils";
import { useChatConversation, ChatMessage } from '@/hooks/useChatConversation';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { useAIUsageTracking } from '@/hooks/useAIUsageTracking';
import { useWindowSize } from '@/hooks/use-window-size';
import { VirtualizedMessageList } from '@/components/chat/shared/VirtualizedMessageList';
import { TypingIndicator } from '@/components/chat/shared/StreamingText';

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
  const [isAITyping, setIsAITyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [panelWidth, setPanelWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('aiChatDrawerWidth') || '400', 10);
    }
    return 400;
  });
  const [isResizing, setIsResizing] = useState(false);
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
    addStreamingAIResponse
  } = useChatConversation({
    conversationType: 'room_collaboration',
    contextId: roomId,
    contextType: 'room',
    autoCreate: open
  });

  const messages = persistedMessages;

  // Prepare conversation history for AI context
  const conversationHistory = persistedMessages.slice(-10).map(msg => ({
    content: msg.content,
    sender_type: msg.sender_type as 'user' | 'ai'
  }));

  // Initialize OpenAI chat hook with streaming support
  const { streamMessageToAI } = useOpenAIChat({
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

  // Show welcome message when drawer opens
  useEffect(() => {
    if (open && conversation && persistedMessages.length === 0 && !welcomeMessageSent) {
      setRateLimitError(null);
      
      if (usageStats && planLimits) {
        const usagePercent = (usageStats.chatRequests / planLimits.dailyChatLimit) * 100;
        setIsNearLimit(usagePercent > 80);
      }
      
      setWelcomeMessageSent(true);
    }
  }, [open, conversation, persistedMessages.length, welcomeMessageSent, usageStats, planLimits]);

  const handleSendMessage = async (content?: string, files?: File[]) => {
    if (!content?.trim() || !conversation) return;

    // Check rate limits before sending
    const rateLimitInfo = await checkRateLimit('chat');
    if (rateLimitInfo && !rateLimitInfo.allowed) {
      setRateLimitError(
        `Daily chat limit reached (${rateLimitInfo.planType} plan). Resets at ${new Date(rateLimitInfo.resetTime).toLocaleTimeString()}`
      );
      return;
    }

    setRateLimitError(null);

    try {
      // Send user message to database
      await sendMessage(content.trim());
      
      // Start streaming AI response
      setIsAITyping(true);

      // Create streaming message placeholder
      const streamHandler = await addStreamingAIResponse();
      
      if (streamHandler) {
        setStreamingMessageId(streamHandler.messageId);
        let fullResponse = '';

        await streamMessageToAI(
          content.trim(),
          (delta) => {
            fullResponse += delta;
            streamHandler.updateContent(fullResponse);
          },
          async () => {
            await streamHandler.finalize(fullResponse);
            setStreamingMessageId(null);
            setIsAITyping(false);
          }
        );
      } else {
        setIsAITyping(false);
      }

    } catch (error) {
      console.error('Error handling message:', error);
      setIsAITyping(false);
      setStreamingMessageId(null);
    }
  };

  const handleNewChat = async () => {
    try {
      if (conversation?.id) {
        const { error: messagesError } = await supabase
          .from('chat_messages')
          .delete()
          .eq('conversation_id', conversation.id);

        if (messagesError) {
          console.error('Error deleting messages:', messagesError);
        }

        const { error: conversationError } = await supabase
          .from('chat_conversations')
          .delete()
          .eq('id', conversation.id);

        if (conversationError) {
          console.error('Error deleting conversation:', conversationError);
        }
      }

      setWelcomeMessageSent(false);
      setRateLimitError(null);
      setIsAITyping(false);
      setStreamingMessageId(null);
      
      toast.success('Started a new chat');
      
      const wasOpen = open;
      onOpenChange(false);
      if (wasOpen) {
        setTimeout(() => onOpenChange(true), 150);
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
      toast.error('Failed to start new chat');
    }
  };

  // Memoized message action handlers
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  }, []);

  const handleEditMessage = useCallback((messageId: string) => {
    console.log('Edit message:', messageId);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    console.log('Delete message:', messageId);
  }, []);

  const handleUpvote = useCallback((messageId: string) => {
    console.log('Upvote:', messageId);
  }, []);

  const handleDownvote = useCallback((messageId: string) => {
    console.log('Downvote:', messageId);
  }, []);

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
          
          {/* Messages Container with Virtualization */}
          <VirtualizedMessageList
            messages={messages}
            className="flex-1 px-4"
            virtualizationThreshold={30}
            renderMessage={(message: ChatMessage, index: number) => {
              const isAssistant = message.sender_type === 'ai';
              const isLastMessage = index === messages.length - 1;
              const isStreaming = message.id === streamingMessageId;

              return (
                <Message
                  className={cn(
                    "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                    isAssistant ? "items-start" : "items-end"
                  )}
                >
                  {isAssistant ? (
                    <div className="group flex w-full flex-col gap-0">
                      <MessageContent
                        className={cn(
                          "text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0",
                          isStreaming && "animate-fade-in"
                        )}
                        markdown
                      >
                        {message.content}
                      </MessageContent>
                      {/* Streaming cursor indicator */}
                      {isStreaming && message.content.length > 0 && (
                        <span 
                          className="inline-block w-1.5 h-4 bg-primary/70 ml-1 animate-pulse rounded-sm"
                          aria-label="AI is typing"
                        />
                      )}
                      <MessageActions
                        className={cn(
                          "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                          isLastMessage && !isStreaming && "opacity-100"
                        )}
                      >
                        <MessageAction tooltip="Copy" delayDuration={100}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleCopyMessage(message.content)}
                            disabled={isStreaming}
                          >
                            <Copy />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Upvote" delayDuration={100}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleUpvote(message.id)}
                            disabled={isStreaming}
                          >
                            <ThumbsUp />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Downvote" delayDuration={100}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleDownvote(message.id)}
                            disabled={isStreaming}
                          >
                            <ThumbsDown />
                          </Button>
                        </MessageAction>
                      </MessageActions>
                    </div>
                  ) : (
                    <div className="group flex flex-col items-end gap-1">
                      <MessageContent className="bg-muted text-primary w-full rounded-3xl px-5 py-2.5">
                        {message.content}
                      </MessageContent>
                      <MessageActions
                        className={cn(
                          "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                        )}
                      >
                        <MessageAction tooltip="Edit" delayDuration={100}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleEditMessage(message.id)}
                          >
                            <Pencil />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Delete" delayDuration={100}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip="Copy" delayDuration={100}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy />
                          </Button>
                        </MessageAction>
                      </MessageActions>
                    </div>
                  )}
                </Message>
              );
            }}
            footerContent={isAITyping && !streamingMessageId ? (
              <Message className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6 items-start">
                <TypingIndicator />
              </Message>
            ) : undefined}
          />
          
          {/* Input Area */}
          <div className="inset-x-0 bottom-0 mx-auto w-full shrink-0 px-6 pb-6">
            <EnhancedPromptInput
              onSubmit={handleSendMessage}
              isLoading={isSending || isAITyping}
              placeholder="Ask about your study materials..."
              className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
