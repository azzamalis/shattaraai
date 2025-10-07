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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ChatInterfaceProps {
  activeTab: UnifiedTabType;
  onTabChange: (tab: UnifiedTabType) => void;
  initialQuery?: string | null;
  contentId?: string;
  roomId?: string | null;
  initialFiles?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    uploadedAt: string;
    content?: string;
  }>;
}

export function ChatInterface({
  activeTab,
  onTabChange,
  initialQuery,
  contentId,
  roomId,
  initialFiles
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
    conversationType: roomId ? 'room_collaboration' : 'general',
    contextId: roomId || contentId,
    contextType: roomId ? 'room' : 'content',
    autoCreate: true
  });

  // Prepare conversation history for AI context
  const conversationHistory = messages.slice(-10)
    .filter(msg => msg.sender_type !== 'system') // Filter out system messages
    .map(msg => ({
      content: msg.content,
      sender_type: msg.sender_type as 'user' | 'ai'
    }));

  // Get all attachments from messages for context
  const allAttachments = messages
    .filter(m => m.attachments && m.attachments.length > 0)
    .flatMap(m => m.attachments || []);

  const { sendMessageToAI } = useOpenAIChatContent({
    conversationId: conversation?.id,
    contextId: contentId,
    conversationHistory,
    attachments: allAttachments
  });

  const handleTitleGenerated = (title: string) => {
    console.log('Chat title generated:', title);
    // Title is automatically updated in the database by ChatTitleGenerator
  };

  useEffect(() => {
    // Process initial query once the conversation is ready
    // ONLY process if:
    // 1. We have an initial query
    // 2. Conversation is loaded (not loading)
    // 3. We have NO existing messages (fresh conversation)
    // 4. We haven't already processed it
    if (
      initialQuery && 
      !hasProcessedInitialQuery && 
      !isLoading && 
      conversation && 
      messages.length === 0
    ) {
      console.log('ChatInterface - Processing initial query with files:', { initialQuery, filesCount: initialFiles?.length });
      
      // Send message with pre-uploaded file attachments
      handleSendMessage(initialQuery, undefined, initialFiles);
      setHasProcessedInitialQuery(true);
    }
  }, [initialQuery, conversation?.id, isLoading, messages.length, initialFiles]);

  const handleSendMessage = async (
    content: string, 
    attachments?: File[], 
    preUploadedFiles?: Array<{
      name: string;
      type: string;
      size: number;
      url: string;
      uploadedAt: string;
      content?: string;
    }>
  ) => {
    console.log('ChatInterface - handleSendMessage called with content:', content, 'attachments:', attachments, 'preUploaded:', preUploadedFiles);
    
    const hasFiles = attachments && attachments.length > 0;
    setIsProcessingFiles(hasFiles);
    setIsProcessingAI(true);

    try {
      // 1. Upload files to storage FIRST (if new files provided)
      const uploadedAttachments: Array<{
        name: string;
        type: string;
        size: number;
        url: string;
        uploadedAt: string;
        content?: string;
      }> = preUploadedFiles ? [...preUploadedFiles] : [];

      if (hasFiles) {
        console.log(`Uploading ${attachments.length} files to storage...`);
        
        for (const file of attachments) {
          try {
            const { uploadFileToStorage } = await import('@/lib/storage');
            // Use 'chat' content type to store in 'chat-content' bucket
            const fileUrl = await uploadFileToStorage(file, 'chat', user.id);
            
            // Extract PDF content if it's a PDF file
            let extractedContent: string | undefined;
            if (file.type === 'application/pdf') {
              try {
                console.log(`Extracting content from PDF: ${file.name}`);
                const { data: pdfData, error: pdfError } = await supabase.functions.invoke('extract-pdf-text', {
                  body: { fileUrl }
                });
                
                if (!pdfError && pdfData?.text) {
                  extractedContent = pdfData.text;
                  console.log(`PDF content extracted: ${extractedContent.substring(0, 100)}...`);
                } else {
                  console.error('PDF extraction error:', pdfError);
                }
              } catch (pdfError) {
                console.error('Failed to extract PDF content:', pdfError);
              }
            }
            
            uploadedAttachments.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: fileUrl,
              uploadedAt: new Date().toISOString(),
              content: extractedContent
            });
            
            console.log(`File uploaded: ${file.name} -> ${fileUrl}`);
          } catch (uploadError) {
            console.error(`Failed to upload ${file.name}:`, uploadError);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        
        console.log(`All files uploaded. Total: ${uploadedAttachments.length}`);
        setIsProcessingFiles(false);
      }

      // 2. Send user message with attachment URLs
      console.log('Sending message with attachments:', uploadedAttachments);
      const userMessage = await sendMessage(content, uploadedAttachments.length > 0 ? uploadedAttachments : undefined);
      
      if (userMessage) {
        // 3. Generate AI response with attachment content
        setIsProcessingAI(true);
        try {
          // Build message with attachment content inline
          let messageWithAttachments = content;
          
          if (uploadedAttachments.length > 0) {
            const attachmentsWithContent = uploadedAttachments.filter(a => a.content);
            if (attachmentsWithContent.length > 0) {
              messageWithAttachments += '\n\n--- Attached Documents ---\n';
              for (const attachment of attachmentsWithContent) {
                messageWithAttachments += `\n**File: ${attachment.name}**\n${attachment.content}\n`;
              }
            }
          }
          
          const aiResponse = await sendMessageToAI(messageWithAttachments);
          await addAIResponse(aiResponse);
        } catch (error) {
          console.error('Error getting AI response:', error);
          await addAIResponse('I apologize, but I\'m having trouble processing your request right now. Please try again.');
        } finally {
          setIsProcessingAI(false);
        }

        // 4. Update content status to completed after first exchange
        if (contentId && messages.length === 0) {
          await supabase
            .from('content')
            .update({ 
              processing_status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', contentId);
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
            loadingContent={
              <>
                {isProcessingFiles && (
                  <LoadingIndicator type="files" message="Processing and uploading attachments..." />
                )}
                {isProcessingAI && !isProcessingFiles && (
                  <LoadingIndicator type="ai" />
                )}
              </>
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