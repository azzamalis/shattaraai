import React, { useEffect } from 'react';
import { ChatTabType } from '@/lib/types';
import { ChatTabNavigation } from './ChatTabNavigation';
import { ChatContainer } from './shared/ChatContainer';
import { NotesEditor } from './NotesEditor/NotesEditor';
import { Brain } from 'lucide-react';
import { useChatConversation } from '@/hooks/useChatConversation';
interface ChatInterfaceProps {
  activeTab: ChatTabType;
  onTabChange: (tab: ChatTabType) => void;
  initialQuery?: string | null;
}
export function ChatInterface({
  activeTab,
  onTabChange,
  initialQuery
}: ChatInterfaceProps) {
  const {
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse
  } = useChatConversation({
    conversationType: 'general',
    autoCreate: true
  });
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, messages.length]);
  const handleSendMessage = async (content: string) => {
    const userMessage = await sendMessage(content);
    if (userMessage) {
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        addAIResponse(`I understand you're asking about: "${content}". Let me help you with that!`);
      }, 1000);
    }
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <div className="flex-1 overflow-hidden mx-4 mb-4">
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
              <ChatContainer messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} isSending={isSending} inputPlaceholder="Ask me anything..." emptyStateContent={<div className="text-center">
                    
                    <h3 className="text-dashboard-text dark:text-dashboard-text mb-2 font-medium text-lg">
                      Learn with the Shattara AI Tutor
                    </h3>
                    <p className="text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 text-center max-w-md text-sm">
                      Start a conversation to get help with any topic, generate quizzes, create flashcards, and more.
                    </p>
                  </div>} />
            </div>
          </div>;
      case 'notes':
        return <div className="flex-1 overflow-hidden mx-4 mb-4">
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
              <NotesEditor />
            </div>
          </div>;
      case 'flashcards':
      case 'quizzes':
        return <div className="flex-1 overflow-hidden mx-4 mb-4">
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
              <EmptyStates type={activeTab} />
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="flex flex-col h-full bg-dashboard-card dark:bg-dashboard-card">
      <ChatTabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      {renderTabContent()}
    </div>;
}
interface EmptyStatesProps {
  type: ChatTabType;
}
export function EmptyStates({
  type
}: EmptyStatesProps) {
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
      default:
        return null;
    }
  };
  const content = getContent();
  if (!content) return null;
  return <div className="flex flex-col items-center justify-center h-full p-8">
      <p className="text-muted-foreground text-center max-w-md">
        {content.description}
      </p>
    </div>;
}