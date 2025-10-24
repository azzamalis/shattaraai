import { PromptInputChatBox } from '@/components/chat/shared/PromptInputChatBox';

interface QuizChatPromptProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export const QuizChatPrompt = ({ onSendMessage, isSending }: QuizChatPromptProps) => {
  return (
    <div className="px-2 pb-4">
      <PromptInputChatBox
        onSendMessage={onSendMessage}
        disabled={isSending}
        placeholder="Learn anything"
      />
    </div>
  );
};
