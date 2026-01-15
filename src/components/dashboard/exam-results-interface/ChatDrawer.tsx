
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Copy, ThumbsUp, ThumbsDown, Pen, GripVertical, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { MessageContent } from '@/components/prompt-kit/message';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useWindowSize } from '@/hooks/use-window-size';
import { VirtualizedMessageList } from '@/components/chat/shared/VirtualizedMessageList';
import { EnhancedPromptInput } from '@/components/ui/enhanced-prompt-input';
import { TypingIndicator } from '@/components/chat/shared/StreamingText';

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
  currentQuestionText?: string | null;
  onClearQuestionReference?: () => void;
  examId?: string;
  contentId?: string;
  roomId?: string | null;
  chatType?: 'question' | 'room';
}

const TABS = [
  { id: 'chat', label: 'Chat', hasIndicator: true },
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

export function ChatDrawer({ 
  isOpen, 
  onClose, 
  currentQuestionId, 
  currentQuestionText,
  onClearQuestionReference,
  examId, 
  contentId, 
  roomId, 
  chatType = 'question' 
}: ChatDrawerProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState('chat');
  const [panelWidth, setPanelWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('examChatDrawerWidth') || '576', 10);
    }
    return 576;
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

  // Handle keyboard resize
  const handleKeyboardResize = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
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
        setChatMessages([]);
      }
    }
  }, [isOpen, currentQuestionId, examId, chatType, roomId]);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatMessages.length > 0) {
      const chatKey = chatType === 'question' && currentQuestionId && examId 
        ? `chat-history-${examId}-${currentQuestionId}`
        : `space-chat-history-${examId || roomId || 'default'}`;
      
      localStorage.setItem(chatKey, JSON.stringify(chatMessages));
    }
  }, [chatMessages, currentQuestionId, examId, chatType, roomId]);

  const handleSendMessage = async (content?: string) => {
    if (!content?.trim() || !examId) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isUser: true,
      content: content.trim(),
      timestamp: new Date(),
      status: 'sending'
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Prepare conversation history
      const conversationHistory = chatMessages.map(msg => ({
        content: msg.content,
        sender_type: msg.isUser ? 'user' : 'ai'
      }));

      const { data, error } = await supabase.functions.invoke('openai-exam-chat', {
        body: {
          message: content.trim(),
          examId,
          questionId: currentQuestionId,
          questionText: currentQuestionText,
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

  const handleNewChat = useCallback(() => {
    const chatKey = chatType === 'question' && currentQuestionId && examId 
      ? `chat-history-${examId}-${currentQuestionId}`
      : `space-chat-history-${examId || roomId || 'default'}`;
    
    localStorage.removeItem(chatKey);
    setChatMessages([]);
    setIsTyping(false);
    toast.success('Started a new chat');
  }, [chatType, currentQuestionId, examId, roomId]);

  // Memoized handlers
  const handleCopyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Message copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy message');
    }
  }, []);

  const handleEditMessage = useCallback((messageId: string) => {
    toast.info('Edit functionality coming soon');
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success('Message deleted');
  }, []);

  const handleUpvote = useCallback((messageId: string) => {
    toast.success('Thanks for the feedback!');
  }, []);

  const handleDownvote = useCallback((messageId: string) => {
    toast.info('Thanks for the feedback!');
  }, []);

  if (!isOpen) return null;

  return (
    <aside 
      className={cn(
        "fixed right-0 top-0 z-50 h-screen border-l border-primary/5",
        "transition-all duration-200 ease-in-out bg-background pointer-events-auto",
        "translate-x-0"
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
            onClick={onClose}
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

              {/* Messages or Empty State */}
              {chatMessages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center">
                  <EmptyState />
                </div>
              ) : (
                <VirtualizedMessageList
                  messages={chatMessages}
                  className="flex-1"
                  virtualizationThreshold={30}
                  renderMessage={(message, index) => {
                    const isAssistant = !message.isUser;

                    return (
                      <div className="mx-auto flex w-full max-w-3xl flex-grow flex-col px-4 sm:px-4">
                        <div className="w-full">
                          <div className="space-y-8">
                            {isAssistant ? (
                              /* AI Message */
                              <div className="flex flex-col gap-2">
                                <div className="w-full">
                                  <div className="flex w-full justify-start">
                                    <div className="w-full">
                                      <div className="relative rounded-3xl text-left leading-relaxed text-primary/95 w-full group bg-transparent p-0 pt-1">
                                        <MessageContent
                                          className="prose prose-neutral dark:prose-invert max-w-none text-foreground"
                                          markdown
                                        >
                                          {message.content}
                                        </MessageContent>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* AI Message Actions */}
                                <div className="py-1">
                                  <div className="flex flex-row items-center space-x-1">
                                    <button
                                      onClick={() => handleCopyMessage(message.content)}
                                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-1.5 text-muted-foreground"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleUpvote(message.id)}
                                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-1.5 text-muted-foreground"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDownvote(message.id)}
                                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-1.5 text-muted-foreground"
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* User Message */
                              <div className="flex flex-col gap-2">
                                <div className="flex w-full justify-end">
                                  <div className="group/message flex w-full flex-col items-end gap-1">
                                    <div className="flex w-full justify-end">
                                      <div className="relative w-fit rounded-3xl p-3 text-left leading-relaxed text-primary/95 border border-primary/5 bg-primary/5 dark:bg-neutral-800">
                                        <MessageContent
                                          className="prose prose-neutral dark:prose-invert max-w-none"
                                          markdown={false}
                                        >
                                          {message.content}
                                        </MessageContent>
                                      </div>
                                    </div>
                                    {/* User Message Actions */}
                                    <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover/message:opacity-100">
                                      <button
                                        onClick={() => handleEditMessage(message.id)}
                                        className="rounded-full p-1 transition-colors hover:bg-primary/10"
                                        aria-label="Edit message"
                                      >
                                        <Pen className="h-3 w-3 text-primary/60" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                  footerContent={isTyping ? (
                    <div className="mx-auto flex w-full max-w-3xl flex-grow flex-col px-4 sm:px-4 items-start">
                      <TypingIndicator />
                    </div>
                  ) : undefined}
                />
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="mx-auto mt-0 w-full max-w-3xl px-2 sm:px-0">
          <EnhancedPromptInput
            onSubmit={handleSendMessage}
            isLoading={isTyping}
            placeholder="Learn anything"
            hideAttachments={false}
            showMicrophone={false}
            showContextButton={false}
            contextReference={currentQuestionText ? {
              text: currentQuestionText,
              onClear: onClearQuestionReference
            } : null}
            className="border-input bg-white dark:bg-neutral-800/50 relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-[0_4px_10px_rgba(0,0,0,0.02)]"
          />
        </div>
      </div>
    </aside>
  );
}
