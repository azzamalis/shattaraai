import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { X, Loader2, AlertCircle, Clock, GripVertical, SquarePen, Copy, ThumbsUp, ThumbsDown, Pencil, Trash, Plus, History, Maximize2, Sparkles, Layers, FileQuestion, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const TABS = [
  { id: 'chat', label: 'Chat', icon: null, hasIndicator: true },
];

function EmptyState() {
  return (
    <div className="mb-[72px] flex flex-col items-center justify-center p-4 text-center text-primary/40 dark:text-primary/60">
      <div className="mb-4 opacity-20">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
      </div>
      <p className="mb-1 text-base font-medium text-primary/40 dark:text-primary/60">
        Learn with Shattara AI
      </p>
    </div>
  );
}

export function AITutorChatDrawer({
  open,
  onOpenChange,
  roomId,
  roomContent = []
}: AITutorChatDrawerProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [isAITyping, setIsAITyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [panelWidth, setPanelWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('aiChatDrawerWidth') || '576', 10);
    }
    return 576;
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
    addStreamingAIResponse,
    clearConversation
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
    
    const newWidth = Math.max(400, Math.min(windowWidth * 0.8, windowWidth - e.clientX));
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
      // Use the clearConversation function from the hook
      const success = await clearConversation();
      
      if (success) {
        setWelcomeMessageSent(false);
        setRateLimitError(null);
        setIsAITyping(false);
        setStreamingMessageId(null);
        
        toast.success('Started a new chat');
      } else {
        toast.error('Failed to clear chat');
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
      const newWidth = Math.max(400, panelWidth - 20);
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
      <aside 
        className={cn(
          "h-full border-l border-primary/5 flex-shrink-0",
          "transition-all duration-200 ease-in-out bg-background"
        )}
        style={{ width: isMobile ? '100%' : panelWidth }}
      >
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading chat...</span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={cn(
        "h-full border-l border-primary/5 flex-shrink-0",
        "transition-all duration-200 ease-in-out bg-background"
      )}
      aria-hidden="false"
      style={{ width: isMobile ? '100%' : panelWidth }}
    >
      {/* Resize Handle */}
      {!isMobile && (
        <div
          ref={resizeRef}
          className="absolute left-0 top-0 h-full w-1 hover:bg-primary/20 cursor-col-resize transition-colors z-10 group"
          onMouseDown={handleResizeStart}
          role="separator"
          aria-label="Resize chat panel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              const newWidth = Math.max(400, panelWidth - 20);
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

      <div className="relative flex h-full flex-col overflow-y-auto px-1 pb-1 pt-4">
        {/* Header */}
        <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
          {/* Close Button - Left */}
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground transition-opacity duration-300 ease-in-out hover:text-foreground w-9"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>

          {/* Tabs - Center */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex justify-center">
            <TabsList className="inline-flex p-1 text-muted-foreground relative h-auto w-fit items-center justify-center overflow-x-auto rounded-2xl border border-primary/10 bg-white px-[3px] dark:border-primary/5 dark:bg-neutral-800/50">
              <div className="flex items-center gap-1 overflow-x-auto overscroll-x-none scrollbar-hide">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "justify-center whitespace-nowrap px-3 text-sm transition-all",
                      "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                      "rounded-lg font-normal hover:bg-primary/5 flex items-center gap-2",
                      "text-primary/80 data-[state=active]:text-primary hover:text-primary",
                      "data-[state=active]:bg-primary/5 dark:data-[state=active]:bg-primary/10",
                      "dark:border-primary/10 data-[state=active]:border-transparent",
                      "dark:data-[state=active]:border-transparent py-1.5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {tab.hasIndicator && (
                        <div className="mx-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                      )}
                      {tab.icon && <tab.icon className="h-4 w-4" />}
                      {tab.label}
                    </div>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </Tabs>

          {/* Spacer for centering */}
          <div className="w-9" />
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto overscroll-y-none scrollbar-hide">
          <div className="flex h-full w-full flex-col">
            <div className="relative flex h-full w-full flex-col md:h-[calc(100vh-84px)] px-0">
              {/* Floating Action Buttons */}
              <div className="absolute right-0 top-0 z-40 mt-1 xl:-mt-2">
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleNewChat}
                          className="h-9 w-9 rounded-xl text-primary/60 hover:bg-primary/5"
                          aria-label="New conversation"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>New conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Chat Tab Content */}
              {activeTab === 'chat' && (
                <>
                  {/* Usage Warning */}
                  {isNearLimit && (
                    <Alert className="mx-4 my-2 shrink-0">
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
                    <Alert variant="destructive" className="mx-4 my-2 shrink-0">
                      <Clock className="h-4 w-4" />
                      <AlertDescription className="text-sm break-words">{rateLimitError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Messages or Empty State */}
                  {messages.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center">
                      <EmptyState />
                    </div>
                  ) : (
                    <VirtualizedMessageList
                      messages={messages}
                      className="flex-1 px-4 pt-8"
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
                  )}
                </>
              )}

              {/* Flashcards Tab Content */}
              {activeTab === 'flashcards' && (
                <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
                  <Layers className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Flashcards coming soon</p>
                </div>
              )}

              {/* Quizzes Tab Content */}
              {activeTab === 'quizzes' && (
                <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
                  <FileQuestion className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Quizzes coming soon</p>
                </div>
              )}

              {/* Summary Tab Content */}
              {activeTab === 'summary' && (
                <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Summary coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area - Only show for chat tab */}
        {activeTab === 'chat' && (
          <div className="mx-auto mt-0 w-full max-w-3xl px-2 sm:px-0">
            <EnhancedPromptInput
              onSubmit={handleSendMessage}
              isLoading={isSending || isAITyping}
              placeholder="Learn anything"
              hideAttachments={false}
              className="border-input bg-white dark:bg-neutral-800/50 relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-[0_4px_10px_rgba(0,0,0,0.02)]"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
