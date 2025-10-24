import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
}

export const MultipleChoiceQuestion = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
}: MultipleChoiceQuestionProps) => {
  return (
    <div className="w-full">
      <h2 className="flex items-center mb-4">
        <div className="max-w-none text-base font-medium">{question}</div>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSelectAnswer(option)}
            className={`items-center justify-start inline-flex w-full h-auto border-2 rounded-2xl p-4 ${
              selectedAnswer === option ? 'border-primary' : 'border-border'
            }`}
          >
            {selectedAnswer === option && <Check className="w-4 h-4 mr-2" />}
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
