import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExplanationBox } from './ExplanationBox';

interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
  isChecked?: boolean;
  correctAnswer?: string;
  showDontKnow?: boolean;
  explanation?: string;
  reference?: string;
}

export const MultipleChoiceQuestion = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  isChecked = false,
  correctAnswer,
  showDontKnow = false,
  explanation,
  reference,
}: MultipleChoiceQuestionProps) => {
  const getOptionStyle = (option: string) => {
    // Don't show feedback if not checked or don't know
    if (!isChecked && !showDontKnow) {
      return selectedAnswer === option ? 'border-primary' : 'border-border';
    }

    // Show feedback after check or don't know
    if (option === correctAnswer) {
      // Correct answer styling
      if (showDontKnow) {
        return 'border-yellow-500 border-dashed'; // Don't know state
      }
      return selectedAnswer === option 
        ? 'border-green-500' // User selected correct
        : 'border-green-500 border-dashed'; // Correct answer when user was wrong
    }

    // User selected wrong answer
    if (selectedAnswer === option && isChecked) {
      return 'border-red-500';
    }

    return 'border-border';
  };

  const getExplanationType = (): 'correct' | 'incorrect' | 'dont-know' | null => {
    if (showDontKnow) return 'dont-know';
    if (!isChecked) return null;
    return selectedAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const explanationType = getExplanationType();
  const showExplanation = (isChecked || showDontKnow) && explanation && explanationType;
  const isDisabled = isChecked || showDontKnow;

  return (
    <div className="w-full">
      <h2 className="flex items-center mb-4">
        <div className="max-w-none text-base font-medium">{question}</div>
      </h2>
      
      <div className="flex flex-col gap-3 text-sm">
        {options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedAnswer === option;
          const isCorrect = option === correctAnswer;
          const showCheck = isSelected && !isDisabled;

          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => !isDisabled && onSelectAnswer(option)}
              disabled={isDisabled}
              className={`items-start justify-start inline-flex w-full h-16 border-2 rounded-2xl p-4 ${getOptionStyle(option)} hover:bg-accent/50 disabled:opacity-100 disabled:cursor-default`}
            >
              <span className="mr-3 font-medium">{optionLetter}.</span>
              <div className="flex-1 text-left">{option}</div>
              {showCheck && <Check className="w-4 h-4 ml-2 shrink-0" />}
            </Button>
          );
        })}
      </div>

      {showExplanation && (
        <ExplanationBox
          type={explanationType}
          explanation={explanation}
          reference={reference}
        />
      )}
    </div>
  );
};
