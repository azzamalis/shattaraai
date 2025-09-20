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
import { useOpenAIChatContent } from '@/hooks/useOpenAIChatContent';
import { ChatTitleGenerator } from './shared/ChatTitleGenerator';
import { LoadingIndicator } from './LoadingIndicator';
import { useAuth } from '@/hooks/useAuth';

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
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const { user } = useAuth();
  
  const {
    conversation,
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

  // Prepare conversation history for AI context
  const conversationHistory = messages.slice(-10)
    .filter(msg => msg.sender_type !== 'system') // Filter out system messages
    .map(msg => ({
      content: msg.content,
      sender_type: msg.sender_type as 'user' | 'ai'
    }));

  const { sendMessageToAI } = useOpenAIChatContent({
    conversationId: conversation?.id,
    contextId: contentId,
    conversationHistory
  });

  const handleTitleGenerated = (title: string) => {
    console.log('Chat title generated:', title);
    // Title is automatically updated in the database by ChatTitleGenerator
  };

  useEffect(() => {
    // Process initial query once the conversation is ready and we haven't processed it yet
    // Only process if we have no existing messages (empty conversation)
    if (initialQuery && !hasProcessedInitialQuery && !isLoading && sendMessage && messages.length === 0 && conversation) {
      console.log('ChatInterface - Processing initial query:', initialQuery, 'Messages count:', messages.length);
      
      // Process immediately since conversation is ready
      handleSendMessage(initialQuery);
      setHasProcessedInitialQuery(true);
    }
  }, [initialQuery, hasProcessedInitialQuery, isLoading, sendMessage, messages.length, conversation]);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    console.log('ChatInterface - handleSendMessage called with content:', content, 'attachments:', attachments);
    
    try {
      // Process files if attachments exist
      let fileContent = '';
      if (attachments && attachments.length > 0) {
        if (!user?.id) {
          console.error('User not authenticated for file upload');
          return;
        }
        
        setIsProcessingFiles(true);
        try {
          const { processAndUploadFiles, formatFileContentForAI } = await import('@/utils/fileProcessing');
          const processedFiles = await processAndUploadFiles(attachments, user.id);
          fileContent = formatFileContentForAI(processedFiles);
        } catch (error) {
          console.error('Error processing files:', error);
          setIsProcessingFiles(false);
          return;
        }
        setIsProcessingFiles(false);
      }

      const fullContent = content + fileContent;
      const userMessage = await sendMessage(fullContent, attachments);
      
      if (userMessage) {
        // Get AI response using the real OpenAI integration
        setIsProcessingAI(true);
        try {
          const aiResponse = await sendMessageToAI(fullContent);
          await addAIResponse(aiResponse);
        } catch (error) {
          console.error('Error getting AI response:', error);
          await addAIResponse('I apologize, but I\'m having trouble processing your request right now. Please try again.');
        } finally {
          setIsProcessingAI(false);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessingFiles(false);
      setIsProcessingAI(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dashboard-card dark:bg-dashboard-card">
      {/* Auto-generate chat titles */}
      {conversation?.id && (
        <ChatTitleGenerator
          conversationId={conversation.id}
          initialQuery={initialQuery}
          contentId={contentId}
          onTitleGenerated={handleTitleGenerated}
        />
      )}
      
      <UnifiedTabNavigation 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        variant="chat"
      />
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <UnifiedTabContent activeTab="chat" variant="chat">
          <div className="flex flex-col h-full">
            <ChatContainer 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              isSending={isSending || isProcessingAI || isProcessingFiles}
              inputPlaceholder="Ask me anything..." 
              emptyStateContent={
                <div className="text-center">
                  <Brain className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                  <h3 className="text-dashboard-text dark:text-dashboard-text mb-2 font-medium text-lg">
                    Learn with the Shattara AI Tutor
                  </h3>
                  <p className="text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 text-center max-w-md text-sm">
                    Start a conversation to get help with any topic, generate quizzes, create flashcards, and more.
                  </p>
                </div>
              } 
            />
            
            {/* Loading indicators */}
            {(isProcessingFiles || isProcessingAI) && (
              <div className="px-4 pb-4">
                {isProcessingFiles && (
                  <LoadingIndicator type="files" message="Processing and uploading attachments..." />
                )}
                {isProcessingAI && !isProcessingFiles && (
                  <LoadingIndicator type="ai" message="AI is analyzing your message..." />
                )}
              </div>
            )}
          </div>
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