
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ExamPrepStepThreeProps {
  currentStep?: number;
  totalSteps?: number;
  numQuestions: string;
  setNumQuestions: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
  examLength: string;
  setExamLength: (value: string) => void;
  onBack: () => void;
  onStartExam: () => void;
}

// Progress bar component
function ExamProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-10 flex justify-center">
      <div className="flex w-1/4 max-w-md gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="h-1.5 flex-1 rounded-full bg-muted">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index < currentStep ? 'bg-green-500' : 'bg-muted-foreground/20'
              }`}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamPrepStepThree({
  currentStep = 3,
  totalSteps = 3,
  numQuestions,
  setNumQuestions,
  questionType,
  setQuestionType,
  examLength,
  setExamLength,
  onBack,
  onStartExam
}: ExamPrepStepThreeProps) {
  // Validation function to check if all required fields are valid
  const isFormValid = () => {
    // Check if number of questions is a valid positive number
    const numQuestionsValid = /^\d+$/.test(numQuestions) && parseInt(numQuestions) > 0;
    
    // Check if question type is selected
    const questionTypeValid = questionType !== '';
    
    // Check if exam length is a valid positive number
    const examLengthValid = /^\d+$/.test(examLength) && parseInt(examLength) > 0;
    
    return numQuestionsValid && questionTypeValid && examLengthValid;
  };

  // Define valid question type options
  const questionTypeOptions = [
    { value: 'Both', label: 'Both' },
    { value: 'Multiple Choice', label: 'Multiple Choice' },
    { value: 'Free Writing', label: 'Free Writing' }
  ];

  return (
    <div className="flex min-h-[460px] w-full flex-col items-center gap-6 rounded-3xl border-2 border-secondary bg-background px-6 sm:px-10 pt-6 shadow-md duration-300 animate-in zoom-in-95 dark:bg-card dark:shadow-[0_0_8px_rgba(255,255,255,0.1)] sm:min-h-[420px] sm:gap-6 lg:px-24">
      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <ExamProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          
          <div className="mt-6 flex flex-col items-center gap-4 sm:mt-0">
            {/* Title */}
            <h2 className="text-center text-lg font-normal leading-relaxed sm:text-2xl 2xl:text-3xl text-foreground mb-4">
              Choose your preference
            </h2>
            
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="numQuestions" className="text-foreground flex items-center text-sm">
                  Number of Questions <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="numQuestions" 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(e.target.value)} 
                  className="bg-background border-border text-foreground h-12 rounded-xl"
                  placeholder="Enter number of questions"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="questionType" className="text-foreground flex items-center text-sm">
                  Question Type <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger className="bg-background border-border text-foreground h-12 rounded-xl">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-[200] rounded-xl">
                    {questionTypeOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value} 
                        className="text-foreground hover:bg-accent/50 rounded-lg"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 sm:col-span-2 sm:max-w-[calc(50%-12px)]">
                <Label htmlFor="examLength" className="text-foreground flex items-center text-sm">
                  Exam Length (Minutes) <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="examLength" 
                  value={examLength} 
                  onChange={(e) => setExamLength(e.target.value)} 
                  placeholder="Enter exam length in minutes" 
                  className="bg-background border-border text-foreground h-12 rounded-xl"
                />
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="mb-6 mt-8 flex flex-row gap-3">
              <Button 
                onClick={onBack}
                variant="outline" 
                size="icon"
                className="h-10 w-10"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
              </Button>
              <Button 
                onClick={onStartExam}
                disabled={!isFormValid()}
                className={cn(
                  "px-6",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Start Exam
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
