
import React from 'react';
import { Upload, ClipboardPaste, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExamPrepStepTwoProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function ExamPrepStepTwo({ onBack, onNext, onSkip }: ExamPrepStepTwoProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Have a practice exam or cheatsheet for reference?
      </h2>
      <p className="text-muted-foreground mb-8">
        We will use this to make the exam as accurate as possible
      </p>
      
      <div className="flex justify-center gap-6 mt-10 mb-20">
        <div className="w-80 h-36 border border-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
          <Upload className="h-6 w-6 text-foreground mb-2" />
          <span className="font-medium text-foreground">Upload</span>
          <span className="text-muted-foreground text-sm">File, Audio, Video</span>
        </div>
        
        <div className="w-80 h-36 border border-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
          <ClipboardPaste className="h-6 w-6 text-foreground mb-2" />
          <span className="font-medium text-foreground">Paste</span>
          <span className="text-muted-foreground text-sm">YouTube, Website, Text</span>
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
            onClick={onNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
