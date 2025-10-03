import React, { useState } from 'react';
import { Copy, RotateCcw, User, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChatInput } from '@/components/chat/shared/ChatInput';
import { RichMessage } from '@/components/chat/RichMessage';
import { LoadingIndicator } from '@/components/chat/LoadingIndicator';
import { useChatConversation } from '@/hooks/useChatConversation';
import { useOpenAIChatContent } from '@/hooks/useOpenAIChatContent';
import { useAuth } from '@/hooks/useAuth';
import { ContentData } from '@/pages/ContentPage';
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from '@/components/prompt-kit/chat-container';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageActions,
  MessageAction,
} from '@/components/prompt-kit/message';

interface AIChatProps {
  contentData?: ContentData;
}

const AIChat = ({ contentData }: AIChatProps) => {
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const { user } = useAuth();

  // Real AI integration with content context
  const {
    conversation,
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse
  } = useChatConversation({
    conversationType: contentData ? 'content_discussion' : 'general',
    contextId: contentData?.id,
    contextType: contentData ? 'content' : undefined,
    autoCreate: true
  });

  // Prepare conversation history for AI context
  const conversationHistory = messages.slice(-10)
    .filter(msg => msg.sender_type !== 'system')
    .map(msg => ({
      content: msg.content,
      sender_type: msg.sender_type as 'user' | 'ai'
    }));

  // AI hook with content context
  const { sendMessageToAI } = useOpenAIChatContent({
    conversationId: conversation?.id,
    contextId: contentData?.id,
    conversationHistory,
    contentData: contentData ? {
      title: contentData.title,
      type: contentData.type,
      text_content: contentData.text_content?.slice(0, 15000) || contentData.text?.slice(0, 15000), // Limit to avoid token overflow
      summary: '', // Summary field not in ContentData type
      chapters: contentData.chapters
    } : undefined
  });

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    try {
      // Process files if attachments exist
      let fileContent = '';
      if (attachments && attachments.length > 0 && Array.isArray(attachments)) {
        if (!user?.id) {
          console.error('User not authenticated for file upload');
          toast.error("Please sign in to upload files.");
          return;
        }
        
        setIsProcessingFiles(true);
        try {
          const { processAndUploadFiles, formatFileContentForAI } = await import('@/utils/fileProcessing');
          const processedFiles = await processAndUploadFiles(attachments, user.id);
          fileContent = formatFileContentForAI(processedFiles);
        } catch (error) {
          console.error('Error processing files:', error);
          toast.error("Failed to process attachments. Please try again.");
          setIsProcessingFiles(false);
          return;
        }
        setIsProcessingFiles(false);
      }

      const fullContent = content + fileContent;
      const userMessage = await sendMessage(fullContent, attachments);
      
      if (userMessage) {
        // Get AI response using real OpenAI integration with content context
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

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleRegenerate = (messageId: string) => {
    toast.info("Regenerating response...");
    // TODO: Implement regenerate logic
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <ChatContainerRoot className="flex-1 min-h-0 px-4">
        <ChatContainerContent>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Brain className="h-16 w-16 text-primary/60 mb-4" />
              <h3 className="text-lg font-semibold text-dashboard-text dark:text-dashboard-text mb-2">
                Chat about this content
              </h3>
              <p className="text-sm text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 max-w-sm">
                Ask questions, request summaries, generate quizzes, or create flashcards from this content.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <Message key={message.id} className="mb-4">
                  <MessageAvatar
                    src={message.sender_type === 'user' ? '/placeholder.svg' : '/lovable-uploads/a5f90647-c593-4fb0-ba43-1a5cedff3bb3.png'}
                    alt={message.sender_type === 'user' ? 'User' : 'AI'}
                    fallback={message.sender_type === 'user' ? 'U' : 'AI'}
                  />
                  <div className="flex-1 min-w-0">
                    {message.sender_type === 'ai' ? (
                      <div>
                        <RichMessage content={message.content} className="mb-2" />
                        <MessageActions>
                          <MessageAction tooltip="Copy message">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(message.content)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Regenerate response">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(message.id)}
                              className="h-8 w-8 p-0"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    ) : (
                      <MessageContent>{message.content}</MessageContent>
                    )}
                  </div>
                </Message>
              ))}
              
              {/* Loading indicators */}
              {isProcessingFiles && (
                <LoadingIndicator type="files" message="Processing and uploading attachments..." />
              )}
              {isProcessingAI && !isProcessingFiles && (
                <LoadingIndicator type="ai" message="AI is analyzing your content..." />
              )}
            </>
          )}
          
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="px-4 pb-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isSending || isProcessingAI || isProcessingFiles}
          placeholder="Ask me anything about this content..."
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AIChat;
