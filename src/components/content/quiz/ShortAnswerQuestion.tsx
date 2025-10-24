import { Textarea } from '@/components/ui/textarea';

interface ShortAnswerQuestionProps {
  question: string;
  answer?: string;
  onAnswerChange: (answer: string) => void;
}

export const ShortAnswerQuestion = ({
  question,
  answer,
  onAnswerChange,
}: ShortAnswerQuestionProps) => {
  return (
    <div className="w-full">
      <h2 className="text-base font-medium mb-4">{question}</h2>
      
      <Textarea
        value={answer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        className="border-2 border-border rounded-2xl p-4 h-32 resize-none"
      />
    </div>
  );
};
