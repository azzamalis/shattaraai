
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { chatMessageStyles } from '@/lib/chatStyles';
import { useChatConversation } from '@/hooks/useChatConversation';
import { useGeminiChat } from '@/hooks/useGeminiChat';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Local UI messages state (cleared when drawer closes)
  const [messages, setMessages] = useState<typeof persistedMessages>([]);

  // Prepare conversation history for AI context (use persisted messages)
  const conversationHistory = persistedMessages.slice(-10).map(msg => ({
    content: msg.content,
    sender_type: msg.sender_type as 'user' | 'ai'
  }));

  // Initialize Gemini chat hook
  const { sendMessageToAI } = useGeminiChat({
    conversationId: conversation?.id || '',
    roomId: roomId || '',
    roomContent,
    conversationHistory
  });

  // Clear UI messages and show fresh welcome when drawer opens
  useEffect(() => {
    if (open && conversation) {
      setMessages([]); // Clear UI messages
      setWelcomeMessageSent(false); // Reset welcome flag
      
      // Add fresh welcome message to UI only
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
  }, [open, conversation, roomContent.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAITyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || !conversation) return;

    const userMessage = input.trim();
    setInput('');

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
        model: 'gemini-1.5-flash-latest',
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
      // Error handling is done in the hook
    } finally {
      setIsAITyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="right" 
          className="w-full sm:w-[400px] p-0 border-l border-border bg-background"
          closeButton={false}
        >
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading chat...</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] p-0 border-l border-border bg-background"
        closeButton={false}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
            <h3 className="text-lg font-semibold text-foreground">Learn with Shattara AI Tutor</h3>
            <SheetClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={chatMessageStyles.wrapper(message.sender_type === 'user')}
              >
                <div className={chatMessageStyles.bubble(message.sender_type === 'user')}>
                  <p className={chatMessageStyles.content}>{message.content}</p>
                  <div className={chatMessageStyles.timestamp}>
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* AI Typing Indicator */}
            {isAITyping && (
              <div className={chatMessageStyles.wrapper(false)}>
                <div className={chatMessageStyles.bubble(false)}>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm text-muted-foreground">AI Tutor is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-6 border-t border-border bg-background">
            <div className="flex gap-3">
              <Input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder="Ask about your study materials..." 
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                disabled={isSending || isAITyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isSending || isAITyping || !conversation} 
                className="
                  bg-primary text-primary-foreground hover:bg-primary/90 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 hover:shadow-sm
                "
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
