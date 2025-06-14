
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ExamPrepStepOne } from './exam-prep/ExamPrepStepOne';
import { ExamPrepStepTwo } from './exam-prep/ExamPrepStepTwo';
import { ExamPrepStepThree } from './exam-prep/ExamPrepStepThree';
import { ContentItem } from './exam-prep/types';
import { useContent } from '@/hooks/useContent';

interface ExamPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to convert database content items to exam prep format
const convertToExamPrepFormat = (dbItems: any[]): ContentItem[] => {
  return dbItems.map(item => ({
    id: item.id,
    title: item.title,
    uploadedDate: new Date(item.created_at).toLocaleDateString('en-GB'),
    type: getDisplayType(item.type),
    isSelected: false
  }));
};

// Helper function to get display type for content
const getDisplayType = (dbType: string): string => {
  switch (dbType) {
    case 'video':
      return 'Video';
    case 'pdf':
      return 'PDF Files';
    case 'recording':
    case 'audio':
      return 'Recording';
    case 'youtube':
      return 'Youtube URL';
    case 'website':
      return 'Website';
    case 'text':
      return 'Text';
    default:
      return 'File';
  }
};

export function ExamPrepModal({ isOpen, onClose }: ExamPrepModalProps) {
  const [step, setStep] = useState(1);
  const [numQuestions, setNumQuestions] = useState('25');
  const [examLength, setExamLength] = useState('60');
  const [questionType, setQuestionType] = useState('Both');
  const navigate = useNavigate();
  const { content, loading } = useContent();
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  
  const totalSteps = 3;

  // Convert database content to exam prep format when content loads
  useEffect(() => {
    if (content && content.length > 0) {
      const convertedItems = convertToExamPrepFormat(content);
      setContentItems(convertedItems);
    }
  }, [content]);

  // Effect to reset state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1); // Reset to Step 1
      setNumQuestions('25'); // Reset number of questions
      setExamLength('60'); // Reset exam length
      setQuestionType('Both'); // Reset question type
      // Reset content selections
      setContentItems(prev => prev.map(item => ({ ...item, isSelected: false })));
    }
  }, [isOpen]);
  
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

  // Show loading state while content is being fetched
  if (loading && contentItems.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn(
          "max-w-3xl p-0 rounded-lg sm:max-w-3xl",
          "bg-card border-border"
        )}>
          <div className="p-6 flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading your content...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
