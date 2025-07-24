
import React, { useEffect, useState } from 'react';
import { ChatTabType } from '@/lib/types';
import { UnifiedTabNavigation, UnifiedTabType } from '@/components/shared/UnifiedTabNavigation';
import { UnifiedTabContent, UnifiedTabContainer } from '@/components/shared/UnifiedTabContent';
import { Tabs } from '@/components/ui/tabs';
import { ChatContainer } from './shared/ChatContainer';
import { NotesEditor } from './NotesEditor/NotesEditor';
import { ChatSummaryDisplay } from './ChatSummaryDisplay';
import { ChatFlashcardContainer } from './ChatFlashcardContainer';
import { Brain } from 'lucide-react';
import { useChatConversation } from '@/hooks/useChatConversation';

interface ChatInterfaceProps {
  activeTab: UnifiedTabType;
  onTabChange: (tab: UnifiedTabType) => void;
  initialQuery?: string | null;
  contentId?: string;
}

export function ChatInterface({
  activeTab,
  onTabChange,
  initialQuery,
  contentId
}: ChatInterfaceProps) {
  const [hasProcessedInitialQuery, setHasProcessedInitialQuery] = useState(false);
  
  const {
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse
  } = useChatConversation({
    conversationType: 'general',
    contextId: contentId,
    contextType: 'content',
    autoCreate: true
  });

  useEffect(() => {
    // Process initial query once the conversation is ready and we haven't processed it yet
    // Only process if we have no existing messages (empty conversation)
    if (initialQuery && !hasProcessedInitialQuery && !isLoading && sendMessage && messages.length === 0) {
      console.log('ChatInterface - Processing initial query:', initialQuery, 'Messages count:', messages.length);
      
      // Delay the initial message to ensure conversation is fully set up
      setTimeout(() => {
        handleSendMessage(initialQuery);
        setHasProcessedInitialQuery(true);
      }, 100);
    }
  }, [initialQuery, hasProcessedInitialQuery, isLoading, sendMessage, messages.length]);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    console.log('ChatInterface - handleSendMessage called with content:', content, 'attachments:', attachments);
    
    try {
      const userMessage = await sendMessage(content, attachments);
      if (userMessage) {
        // Simulate AI response (replace with actual AI integration)
        setTimeout(() => {
          addAIResponse(`I understand you're asking about: "${content}". Let me help you with that!`);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dashboard-card dark:bg-dashboard-card">
      <UnifiedTabNavigation 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        variant="chat"
      />
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
        <UnifiedTabContent activeTab="chat" variant="chat">
          <ChatContainer 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            isSending={isSending} 
            inputPlaceholder="Ask me anything..." 
            emptyStateContent={
              <div className="text-center">
                <h3 className="text-dashboard-text dark:text-dashboard-text mb-2 font-medium text-lg">
                  Learn with the Shattara AI Tutor
                </h3>
                <p className="text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 text-center max-w-md text-sm">
                  Start a conversation to get help with any topic, generate quizzes, create flashcards, and more.
                </p>
              </div>
            } 
          />
        </UnifiedTabContent>

        <UnifiedTabContent activeTab="flashcards" variant="chat">
          <ChatFlashcardContainer messages={messages} />
        </UnifiedTabContent>

        <UnifiedTabContent activeTab="quizzes" variant="chat">
          <EmptyStates type={activeTab} />
        </UnifiedTabContent>

        <UnifiedTabContent activeTab="summary" variant="chat">
          <ChatSummaryDisplay messages={messages} />
        </UnifiedTabContent>

        <UnifiedTabContent activeTab="notes" variant="chat">
          <NotesEditor />
        </UnifiedTabContent>
        </div>
      </Tabs>
    </div>
  );
}

interface EmptyStatesProps {
  type: UnifiedTabType;
}

export function EmptyStates({ type }: EmptyStatesProps) {
  const getContent = () => {
    switch (type) {
      case 'flashcards':
        return {
          description: 'Learn with the Shattara AI Tutor using interactive flashcards.'
        };
      case 'quizzes':
        return {
          description: 'Learn with the Shattara AI Tutor through adaptive quizzes.'
        };
      case 'summary':
        return {
          description: 'Your conversation summaries will appear here as you chat.'
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <p className="text-muted-foreground text-center max-w-md">
        {content.description}
      </p>
    </div>
  );
}
