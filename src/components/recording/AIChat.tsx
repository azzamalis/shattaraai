import React, { useState } from 'react';
import { Copy, Brain, ThumbsUp, ThumbsDown, Pen, MoreVertical } from 'lucide-react';
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
import { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor } from '@/components/prompt-kit/chat-container';
import { Message, MessageActions, MessageAction } from '@/components/prompt-kit/message';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
interface AIChatProps {
  contentData?: ContentData;
}
const AIChat = ({
  contentData
}: AIChatProps) => {
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const {
    user
  } = useAuth();

  // Real AI integration with content context
  const {
    conversation,
    messages,
    isLoading,
    isSending,
    sendMessage,
    addStreamingAIResponse
  } = useChatConversation({
    conversationType: contentData ? 'content_discussion' : 'general',
    contextId: contentData?.id,
    contextType: contentData ? 'content' : undefined,
    autoCreate: true
  });

  // Prepare conversation history for AI context
  const conversationHistory = messages.slice(-10).filter(msg => msg.sender_type !== 'system').map(msg => ({
    content: msg.content,
    sender_type: msg.sender_type as 'user' | 'ai'
  }));

  // AI hook with content context and streaming
  const {
    streamMessageToAI
  } = useOpenAIChatContent({
    conversationId: conversation?.id,
    contextId: contentData?.id,
    conversationHistory,
    contentData: contentData ? {
      title: contentData.title,
      type: contentData.type,
      text_content: contentData.text_content?.slice(0, 15000) || contentData.text?.slice(0, 15000),
      summary: '',
      chapters: contentData.chapters
    } : undefined
  });
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    const hasFiles = attachments && attachments.length > 0;
    setIsProcessingFiles(hasFiles);
    setIsProcessingAI(true);
    try {
      // 1. Upload files to storage FIRST
      const uploadedAttachments: Array<{
        name: string;
        type: string;
        size: number;
        url: string;
        uploadedAt: string;
      }> = [];
      if (hasFiles) {
        console.log(`Uploading ${attachments.length} files to storage...`);
        for (const file of attachments) {
          try {
            const {
              uploadFileToStorage
            } = await import('@/lib/storage');
            const fileUrl = await uploadFileToStorage(file, 'chat', user.id);
            uploadedAttachments.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: fileUrl,
              uploadedAt: new Date().toISOString()
            });
            console.log(`File uploaded: ${file.name} -> ${fileUrl}`);
          } catch (uploadError) {
            console.error(`Failed to upload ${file.name}:`, uploadError);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        setIsProcessingFiles(false);
      }

      // 2. Send user message with attachment URLs
      const userMessage = await sendMessage(content, uploadedAttachments);
      if (userMessage) {
        // 3. Get streaming AI response
        setIsProcessingAI(true);
        try {
          const streamHandler = await addStreamingAIResponse();
          if (streamHandler) {
            let fullResponse = '';
            await streamMessageToAI(
              content,
              (delta) => {
                fullResponse += delta;
                streamHandler.updateContent(fullResponse);
              },
              async () => {
                await streamHandler.finalize(fullResponse);
                setIsProcessingAI(false);
              }
            );
          }
        } catch (error) {
          console.error('Error getting AI response:', error);
          setIsProcessingAI(false);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsProcessingAI(false);
      setIsProcessingFiles(false);
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
  return <div className="flex flex-col h-full gap-4">
      <ChatContainerRoot className="flex-1 min-h-0 px-4">
        <ChatContainerContent className="space-y-8">
          {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Brain className="h-16 w-16 text-primary/60 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Learn with Shattara AI</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask questions, request summaries, generate quizzes, or create flashcards from this content.
              </p>
            </div> : <>
              {messages.map((message, index) => {
            const isAssistant = message.sender_type === 'ai';
            const isLastMessage = index === messages.length - 1;
            return <div key={message.id} className={cn("flex w-full", isAssistant ? "justify-start" : "justify-end")}>
                    {isAssistant ? (
                      <div className="group/message flex w-full flex-col items-start gap-1">
                        <div className="relative w-full rounded-3xl text-left leading-relaxed text-primary/95 bg-transparent p-0 pt-1">
                          <RichMessage content={message.content} className="w-full" />
                        </div>
                        <div className="py-3">
                          <MessageActions className={cn("flex items-center gap-1 opacity-0 transition-opacity duration-200 lg:group-hover/message:opacity-100", isLastMessage && "opacity-100")}>
                            <MessageAction tooltip="Copy" delayDuration={100}>
                              <button 
                                className="inline-flex items-center justify-center rounded-lg h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                onClick={() => handleCopy(message.content)}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </MessageAction>
                            <MessageAction tooltip="Upvote" delayDuration={100}>
                              <button className="inline-flex items-center justify-center rounded-lg h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                            </MessageAction>
                            <MessageAction tooltip="Downvote" delayDuration={100}>
                              <button className="inline-flex items-center justify-center rounded-lg h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </MessageAction>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center justify-center rounded-lg h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleCopy(message.content)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy text
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Share
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </MessageActions>
                        </div>
                      </div>
                    ) : (
                      <div className="group/message flex w-full flex-col items-end gap-1">
                        <div className="flex w-full justify-end">
                          <div className="relative w-fit max-w-[85%] sm:max-w-[75%] rounded-3xl p-3 text-left leading-relaxed text-primary/95 border border-primary/5 bg-primary/5 dark:bg-neutral-800">
                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                              <p className="text-base leading-7 mb-0">{message.content}</p>
                            </div>
                          </div>
                        </div>
                        <MessageActions className="flex items-center gap-1 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover/message:opacity-100">
                          <MessageAction tooltip="Edit" delayDuration={100}>
                            <button className="rounded-full p-1 transition-colors hover:bg-primary/10">
                              <Pen className="h-3 w-3 text-primary/60" />
                            </button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    )}
                  </div>;
          })}
              
              {/* Loading indicators */}
              {isProcessingFiles && <LoadingIndicator type="files" message="Processing and uploading attachments..." />}
              {isProcessingAI && !isProcessingFiles && <LoadingIndicator type="ai" />}
            </>}
          
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="px-4 pb-4">
        <PromptInputChatBox onSendMessage={handleSendMessage} disabled={isSending || isProcessingAI || isProcessingFiles} placeholder="Ask anything about this content..." />
      </div>
    </div>;
};
export default AIChat;