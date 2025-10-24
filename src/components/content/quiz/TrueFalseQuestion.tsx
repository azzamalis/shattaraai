import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrueFalseQuestionProps {
  question: string;
  selectedAnswer?: boolean;
  onSelectAnswer: (answer: boolean) => void;
}

export const TrueFalseQuestion = ({
  question,
  selectedAnswer,
  onSelectAnswer,
}: TrueFalseQuestionProps) => {
  return (
    <div className="w-full">
      <h2 className="flex items-center mb-4">
        <div className="max-w-none text-base font-medium">{question}</div>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <Button
          variant="outline"
          onClick={() => onSelectAnswer(true)}
          className={`items-center justify-start inline-flex w-full h-auto border-2 rounded-2xl p-4 ${
            selectedAnswer === true ? 'border-primary' : 'border-border'
          }`}
        >
          <Check className="w-4 h-4 mr-2" />
          True
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onSelectAnswer(false)}
          className={`items-center justify-start inline-flex w-full h-auto border-2 rounded-2xl p-4 ${
            selectedAnswer === false ? 'border-primary' : 'border-border'
          }`}
        >
          <X className="w-4 h-4 mr-2" />
          False
        </Button>
      </div>
    </div>
  );
};
