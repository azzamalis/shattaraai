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
    <div className="w-full space-y-4">
      <h2 className="text-base font-medium">{question}</h2>
      
      <Textarea
        value={answer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        className="border-2 border-border rounded-2xl p-4 min-h-[160px] resize-none"
      />
    </div>
  );
};
