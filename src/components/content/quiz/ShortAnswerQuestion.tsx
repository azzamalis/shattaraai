import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ShortAnswerQuestionProps {
  question: string;
  answer?: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
}

export const ShortAnswerQuestion = ({
  question,
  answer,
  onAnswerChange,
  onSubmit,
}: ShortAnswerQuestionProps) => {
  return (
    <div className="w-full">
      <h2 className="flex items-center mb-4">
        <div className="max-w-none text-base font-medium">{question}</div>
      </h2>
      
      <div className="space-y-3">
        <Textarea
          value={answer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer here..."
          className="border-2 border-border rounded-2xl p-4 min-h-[120px] resize-none"
        />
        
        <Button
          onClick={onSubmit}
          disabled={!answer?.trim()}
          className="w-full md:w-auto"
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};
