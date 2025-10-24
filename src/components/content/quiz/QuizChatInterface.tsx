import { useState, useEffect } from 'react';
import { useChatConversation } from '@/hooks/useChatConversation';
import { useOpenAIChatContent } from '@/hooks/useOpenAIChatContent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PromptInputChatBox } from '@/components/chat/shared/PromptInputChatBox';
import { RichMessage } from '@/components/chat/RichMessage';
import { Copy, ThumbsUp, ThumbsDown, Volume2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuizChatInterfaceProps {
  quizId: string;
  currentQuestion: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswer?: any;
  assistanceTriggered?: boolean;
}

export const QuizChatInterface = ({
  quizId,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  assistanceTriggered = false,
}: QuizChatInterfaceProps) => {
  const [isChatActive, setIsChatActive] = useState(false);

  const {
    conversation,
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse,
  } = useChatConversation({
    conversationType: 'exam_support',
    contextId: quizId,
    contextType: 'quiz',
    autoCreate: true,
  });

  // Activate chat when assistance is triggered or messages exist
  useEffect(() => {
    if (assistanceTriggered || messages.length > 0) {
      setIsChatActive(true);
    }
  }, [assistanceTriggered, messages.length]);

  const { sendMessageToAI } = useOpenAIChatContent({
    conversationId: conversation?.id,
    contextId: quizId,
    conversationHistory: messages.filter(m => m.sender_type !== 'system').slice(-10).map(m => ({
      content: m.content,
      sender_type: m.sender_type as 'user' | 'ai'
    })),
    contentData: {
      title: `Quiz Question ${currentQuestionIndex + 1}`,
      type: 'quiz',
      text_content: JSON.stringify({
        question: currentQuestion.question,
        questionNumber: currentQuestionIndex + 1,
        totalQuestions,
        userAnswer,
      }),
    },
  });

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isSending) return;

    // Activate chat when user sends first message
    setIsChatActive(true);

    try {
      await sendMessage(messageText);
      const aiResponse = await sendMessageToAI(messageText);
      await addAIResponse(aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Messages Area - Hidden by default */}
      {isChatActive && (
        <ScrollArea className="flex-1 min-h-0 px-2">
          <div className="flex flex-col space-y-4 py-4">
            {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              {message.sender_type === 'user' ? (
                // User message
                <div className="flex justify-end">
                  <div className="flex flex-col items-end max-w-[80%]">
                    <div className="bg-muted border-2 border-muted rounded-3xl p-3">
                      {message.content}
                    </div>
                  </div>
                </div>
              ) : (
                // AI message
                <div className="flex justify-start">
                  <div className="flex-1">
                    <div className="pt-1 rounded-3xl">
                      <RichMessage content={message.content} />
                    </div>
                    {/* Action buttons */}
                    <div className="py-3 text-muted">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(message.content)}
                            className="w-7 h-7 rounded-xl p-1.5"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-xl p-1.5"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-xl p-1.5"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-xl p-1.5"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-xl p-1.5"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-muted border-2 border-muted rounded-3xl p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          </div>
        </ScrollArea>
      )}

      {/* Chat Input */}
      <div className={`pb-4 px-2 ${isChatActive ? 'pt-2' : 'pt-0'}`}>
        <PromptInputChatBox
          onSendMessage={handleSendMessage}
          disabled={isSending}
          placeholder="Learn anything"
        />
      </div>
    </div>
  );
};
