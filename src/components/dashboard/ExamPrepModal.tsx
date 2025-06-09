import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ExamPrepStepOne } from './exam-prep/ExamPrepStepOne';
import { ExamPrepStepTwo } from './exam-prep/ExamPrepStepTwo';
import { ExamPrepStepThree } from './exam-prep/ExamPrepStepThree';
import { ContentItem } from './exam-prep/types';

interface ExamPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initial content items for a fresh start
const initialContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'The British Empire',
    uploadedDate: '30/05/2025',
    type: 'Video',
    isSelected: false
  },
  {
    id: '2',
    title: 'Think Fast, Talk Smart',
    uploadedDate: '30/05/2025',
    type: 'Video',
    isSelected: false
  },
  {
    id: '3',
    title: 'Understanding Applied Psychology',
    uploadedDate: '30/05/2025',
    type: 'PDF Files',
    isSelected: false
  },
  {
    id: '4',
    title: 'Social Class',
    uploadedDate: '30/05/2025',
    type: 'Recording',
    isSelected: false
  },
  {
    id: '5',
    title: 'Introduction to Quantum Physics',
    uploadedDate: '31/05/2025',
    type: 'Video',
    isSelected: false
  },
  {
    id: '6',
    title: 'Advanced Calculus Notes',
    uploadedDate: '31/05/2025',
    type: 'PDF Files',
    isSelected: false
  },
  {
    id: '7',
    title: 'Machine Learning Lecture',
    uploadedDate: '31/05/2025',
    type: 'Youtube URL',
    isSelected: false
  },
  {
    id: '8',
    title: 'Chemistry Lab Session',
    uploadedDate: '31/05/2025',
    type: 'Recording',
    isSelected: false
  }
];

export function ExamPrepModal({ isOpen, onClose }: ExamPrepModalProps) {
  const [step, setStep] = useState(1);
  const [numQuestions, setNumQuestions] = useState('25');
  const [examLength, setExamLength] = useState('60');
  const [questionType, setQuestionType] = useState('Both');
  const navigate = useNavigate();
  
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems);
  
  const totalSteps = 3;

  // Effect to reset state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1); // Reset to Step 1
      setNumQuestions('25'); // Reset number of questions
      setExamLength('60'); // Reset exam length
      setQuestionType('Both'); // Reset question type
      setContentItems(initialContentItems); // Reset content selections
    }
  }, [isOpen]); // Only re-run when isOpen changes
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleStartExam();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const toggleSelectAll = () => {
    const allSelected = contentItems.every(item => item.isSelected);
    setContentItems(contentItems.map(item => ({
      ...item,
      isSelected: !allSelected
    })));
  };

  const toggleItemSelection = (id: string) => {
    setContentItems(contentItems.map(item => 
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const handleStartExam = () => {
    // Save exam configuration to localStorage
    const examConfig = {
      selectedTopics: contentItems.filter(item => item.isSelected).map(item => item.title),
      numQuestions,
      questionType,
      examLength
    };
    localStorage.setItem('examConfig', JSON.stringify(examConfig));
    
    // Close the modal
    onClose();
    
    // Navigate to loading screen
    navigate('/exam-loading');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-3xl p-0 rounded-lg sm:max-w-3xl",
        "bg-card border-border"
      )}>
        <div className="p-6">
          {/* Progress bar */}
          <div className="flex justify-center mb-8">
            <div className="w-1/3 flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    index + 1 <= step 
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              ))}
            </div>
          </div>
          
          {step === 1 && (
            <ExamPrepStepOne
              contentItems={contentItems}
              onToggleSelectAll={toggleSelectAll}
              onToggleItemSelection={toggleItemSelection}
              onNext={handleNext}
            />
          )}
          
          {step === 2 && (
            <ExamPrepStepTwo
              onBack={handleBack}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}
          
          {step === 3 && (
            <ExamPrepStepThree
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
              questionType={questionType}
              setQuestionType={setQuestionType}
              examLength={examLength}
              setExamLength={setExamLength}
              onBack={handleBack}
              onStartExam={handleStartExam}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
