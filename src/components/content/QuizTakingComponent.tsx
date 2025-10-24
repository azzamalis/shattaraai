import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuizHeader } from './quiz/QuizHeader';
import { QuizProgressBar } from './quiz/QuizProgressBar';
import { MultipleChoiceQuestion } from './quiz/MultipleChoiceQuestion';
import { TrueFalseQuestion } from './quiz/TrueFalseQuestion';
import { ShortAnswerQuestion } from './quiz/ShortAnswerQuestion';
import { QuizActionButtons } from './quiz/QuizActionButtons';
import { AssistanceButton } from './quiz/AssistanceButton';
import { QuizChatInterface } from './quiz/QuizChatInterface';
import { QuizChatPrompt } from './quiz/QuizChatPrompt';
import { useChatConversation } from '@/hooks/useChatConversation';
import { useOpenAIChatContent } from '@/hooks/useOpenAIChatContent';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  hint?: string;
}

interface QuizResults {
  quizId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  skippedQuestions: number;
  timeSpent: number;
  answers: Record<string, any>;
}

interface QuizTakingComponentProps {
  quizId: string;
  quizData: {
    id: string;
    title: string;
    questions: Question[];
    config: any;
  };
  onBack: () => void;
  onComplete: (results: QuizResults) => void;
}

export const QuizTakingComponent = ({
  quizId,
  quizData,
  onBack,
  onComplete,
}: QuizTakingComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());
  const [isChatVisible, setIsChatVisible] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];

  // Chat conversation hook
  const {
    conversation,
    messages,
    isSending,
    sendMessage,
    addAIResponse,
  } = useChatConversation({
    conversationType: 'exam_support',
    contextId: quizId,
    contextType: 'quiz',
    autoCreate: true,
  });

  const { sendMessageToAI } = useOpenAIChatContent({
    conversationId: conversation?.id,
    contextId: quizId,
    conversationHistory: messages
      .filter(m => m.sender_type !== 'system')
      .map((msg) => ({
        content: msg.content,
        sender_type: msg.sender_type as 'user' | 'ai',
      })),
    contentData: {
      title: `Quiz Question ${currentQuestionIndex + 1}`,
      type: 'quiz',
      text_content: JSON.stringify({
        question: currentQuestion?.question,
        questionType: currentQuestion?.type,
        questionNumber: currentQuestionIndex + 1,
        totalQuestions: quizData.questions.length,
        userAnswer: currentAnswer || 'Not answered yet',
        options: currentQuestion?.options,
      }),
    },
  });

  const handleSelectAnswer = (answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleCheck = () => {
    if (!currentAnswer) {
      toast.error('Please select an answer first');
      return;
    }

    // Move to next question or complete quiz
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      toast.success('Answer recorded!');
    } else {
      handleCompleteQuiz();
    }
  };

  const handleUndo = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleDontKnow = () => {
    // Mark as skipped and move to next
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      toast.info('Question skipped');
    } else {
      handleCompleteQuiz();
    }
  };

  const handleDeleteQuestion = () => {
    // Remove current question from quiz data
    const updatedQuestions = quizData.questions.filter((_, index) => index !== currentQuestionIndex);
    
    if (updatedQuestions.length === 0) {
      toast.error('Cannot delete the last question');
      return;
    }

    // Update quiz data
    quizData.questions = updatedQuestions;
    
    // Move to next question or previous if at the end
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
    
    toast.success('Question deleted');
  };

  const handleCompleteQuiz = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const answeredQuestions = Object.keys(answers).length;
    const skippedQuestions = quizData.questions.length - answeredQuestions;

    const results: QuizResults = {
      quizId: quizData.id,
      totalQuestions: quizData.questions.length,
      answeredQuestions,
      correctAnswers: 0, // Would need to validate against correctAnswer
      skippedQuestions,
      timeSpent,
      answers,
    };

    onComplete(results);
  };

  const handleAssistanceClick = async (type: 'hint' | 'walkthrough' | 'simple') => {
    const prompts = {
      hint: 'Give me a hint to help me solve this question.',
      walkthrough: 'Walk me through how to solve this question step by step.',
      simple: 'Explain this question in simpler terms.',
    };
    
    setIsChatVisible(true);
    await handleChatMessage(prompts[type]);
  };

  const handleChatMessage = async (messageText: string) => {
    if (!messageText.trim() || isSending) return;

    setIsChatVisible(true);
    
    try {
      await sendMessage(messageText);
      const aiResponse = await sendMessageToAI(messageText);
      await addAIResponse(aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion.question}
            options={currentQuestion.options || []}
            selectedAnswer={currentAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        );
      case 'true-false':
        return (
          <TrueFalseQuestion
            question={currentQuestion.question}
            selectedAnswer={currentAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        );
      case 'short-answer':
        return (
          <ShortAnswerQuestion
            question={currentQuestion.question}
            answer={currentAnswer}
            onAnswerChange={handleSelectAnswer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      {/* Fixed Header */}
      <div className="shrink-0">
        <QuizHeader
          onBack={onBack}
          onSaveProgress={() => toast.info('Progress saved')}
          onEndQuiz={handleCompleteQuiz}
        />
        <QuizProgressBar
          current={currentQuestionIndex + 1}
          total={quizData.questions.length}
        />
      </div>

      {/* Single Scrollable Area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-2">
          {/* Question Card */}
          <div className="rounded-xl">
            <div className="p-2">
              {/* Question Section with Flag */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {renderQuestion()}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteQuestion}
                  className="shrink-0 w-8 h-8 rounded-xl text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2">
              <QuizActionButtons
                onUndo={handleUndo}
                onCheck={handleCheck}
                onDontKnow={handleDontKnow}
                canUndo={currentQuestionIndex > 0}
                hasAnswer={!!currentAnswer}
                isShortAnswer={currentQuestion?.type === 'short-answer'}
              />
            </div>
          </div>

          {/* Separator */}
          <Separator className="my-4" />

          {/* Assistance Buttons */}
          <div className="flex gap-4 text-sm mb-4">
            <AssistanceButton type="hint" onClick={() => handleAssistanceClick('hint')} />
            <AssistanceButton
              type="walkthrough"
              onClick={() => handleAssistanceClick('walkthrough')}
            />
            <AssistanceButton type="simple" onClick={() => handleAssistanceClick('simple')} />
          </div>

          {/* Chat Prompt - Shows here when chat is visible */}
          {isChatVisible && (
            <>
              <div className="mb-4">
                <QuizChatPrompt onSendMessage={handleChatMessage} isSending={isSending} />
              </div>
              
              {/* Chat Messages */}
              <QuizChatInterface messages={messages} isSending={isSending} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Fixed Chat Prompt at Bottom - Shows when chat is hidden */}
      {!isChatVisible && (
        <div className="shrink-0">
          <QuizChatPrompt onSendMessage={handleChatMessage} isSending={isSending} />
        </div>
      )}
    </div>
  );
};
