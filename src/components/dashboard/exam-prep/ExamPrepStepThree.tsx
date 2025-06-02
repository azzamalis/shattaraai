import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExamPrepStepThreeProps {
  numQuestions: string;
  setNumQuestions: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
  examLength: string;
  setExamLength: (value: string) => void;
  onBack: () => void;
  onSkip: () => void;
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
  onSkip,
  onStartExam
}: ExamPrepStepThreeProps) {
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
              <SelectItem value="Both" className="text-foreground hover:bg-accent/50">Both</SelectItem>
              <SelectItem value="Multiple Choice" className="text-foreground hover:bg-accent/50">Multiple Choice</SelectItem>
              <SelectItem value="Free Writing" className="text-foreground hover:bg-accent/50">Free Writing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="examLength" className="text-foreground">
            Exam Length (Minutes)
          </Label>
          <Input 
            id="examLength" 
            value={examLength} 
            onChange={(e) => setExamLength(e.target.value)} 
            placeholder="e.g. 60" 
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
        <div className="flex gap-2">
          <Button 
            onClick={onSkip}
            variant="ghost" 
            className="text-foreground hover:bg-accent"
          >
            Skip
          </Button>
          <Button 
            onClick={onStartExam}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4"
          >
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
