
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ExamPrepStepThreeProps {
  numQuestions: string;
  setNumQuestions: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
  examLength: string;
  setExamLength: (value: string) => void;
  onBack: () => void;
  onStartExam: () => void;
}

export function ExamPrepStepThree({
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
    <div className="text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">Choose your preference</h2>
      
      <div className="grid grid-cols-2 gap-8 mt-8 mb-8 max-w-2xl mx-auto">
        <div>
          <Label htmlFor="numQuestions" className="text-foreground flex items-center">
            Number of Questions <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="numQuestions" 
            value={numQuestions} 
            onChange={(e) => setNumQuestions(e.target.value)} 
            className="bg-background border-border text-foreground mt-2 h-12"
            placeholder="Enter number of questions"
          />
        </div>
        
        <div>
          <Label htmlFor="questionType" className="text-foreground flex items-center">
            Question Type <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger className="bg-background border-border text-foreground mt-2 h-12">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-[200]">
              {questionTypeOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value} 
                  className="text-foreground hover:bg-accent/50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="examLength" className="text-foreground flex items-center">
            Exam Length (Minutes) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="examLength" 
            value={examLength} 
            onChange={(e) => setExamLength(e.target.value)} 
            placeholder="Enter exam length in minutes" 
            className="bg-background border-border text-foreground mt-2 h-12"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-foreground hover:bg-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onStartExam}
          disabled={!isFormValid()}
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Start Exam
        </Button>
      </div>
    </div>
  );
}
