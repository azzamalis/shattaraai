import React, { useState } from 'react';
import { Copy, RotateCcw, Brain, ThumbsUp, ThumbsDown, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PromptInputChatBox } from '@/components/chat/shared/PromptInputChatBox';
import { RichMessage } from '@/components/chat/RichMessage';
import { LoadingIndicator } from '@/components/chat/LoadingIndicator';
import { useChatConversation } from '@/hooks/useChatConversation';
import { useOpenAIChatContent } from '@/hooks/useOpenAIChatContent';
import { useAuth } from '@/hooks/useAuth';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from '@/components/prompt-kit/chat-container';
import {
  Message,
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
              {messages.map((message, index) => {
                const isAssistant = message.sender_type === 'ai';
                const isLastMessage = index === messages.length - 1;

                return (
                  <Message
                    key={message.id}
                    className={cn(
                      "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                      isAssistant ? "items-start" : "items-end"
                    )}
                  >
                    {isAssistant ? (
                      <div className="group flex w-full flex-col gap-0">
                        <RichMessage content={message.content} className="w-full bg-transparent p-0" />
                        <MessageActions
                          className={cn(
                            "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                            isLastMessage && "opacity-100"
                          )}
                        >
                          <MessageAction tooltip="Copy" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              onClick={() => handleCopy(message.content)}
                            >
                              <Copy />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Upvote" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <ThumbsUp />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Downvote" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <ThumbsDown />
                            </Button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    ) : (
                      <div className="group flex flex-col items-end gap-1">
                        <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
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
                            >
                              <Pencil />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Delete" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Trash />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Copy" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              onClick={() => handleCopy(message.content)}
                            >
                              <Copy />
                            </Button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    )}
                  </Message>
                );
              })}
              
              {/* Loading indicators */}
              {isProcessingFiles && (
                <LoadingIndicator type="files" message="Processing and uploading attachments..." />
              )}
              {isProcessingAI && !isProcessingFiles && (
                <LoadingIndicator type="ai" />
              )}
            </>
          )}
          
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="px-4 pb-4">
        <PromptInputChatBox
          onSendMessage={handleSendMessage}
          disabled={isSending || isProcessingAI || isProcessingFiles}
          placeholder="Ask anything about this content..."
        />
      </div>
    </div>
  );
};

export default AIChat;
