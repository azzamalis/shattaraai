
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ExamPrepStepOneRedesigned } from './exam-prep/ExamPrepStepOneRedesigned';
import { ExamPrepStepTwo } from './exam-prep/ExamPrepStepTwo';
import { ExamPrepStepThree } from './exam-prep/ExamPrepStepThree';
import { ContentItem } from './exam-prep/types';
import { useContent } from '@/hooks/useContent';

interface ExamPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  onSelectionModeChange?: (isActive: boolean) => void;
  selectedContentIds?: string[];
  onContentSelectionChange?: (selectedIds: string[]) => void;
}

// Helper function to convert database content items to exam prep format
const convertToExamPrepFormat = (dbItems: any[]): ContentItem[] => {
  return dbItems.map(item => ({
    id: item.id,
    title: item.title,
    uploadedDate: new Date(item.created_at).toLocaleDateString('en-GB'),
    type: getDisplayType(item.type) as ContentItem['type'],
    isSelected: false
  }));
};

// Helper function to get display type for content
const getDisplayType = (dbType: string): ContentItem['type'] => {
  switch (dbType) {
    case 'video':
      return 'Video';
    case 'pdf':
      return 'PDF Files';
    case 'recording':
    case 'audio':
    case 'audio_file':
    case 'live_recording':
      return 'Recording';
    case 'youtube':
      return 'Youtube URL';
    case 'website':
    case 'text':
    case 'file':
    case 'chat':
    case 'upload':
    default:
      return 'PDF Files';
  }
};

export function ExamPrepModal({ 
  isOpen, 
  onClose, 
  roomId,
  onSelectionModeChange,
  selectedContentIds = [],
  onContentSelectionChange
}: ExamPrepModalProps) {
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
      const filteredContent = roomId 
        ? content.filter(item => item.room_id === roomId)
        : content;
      
      const convertedItems = convertToExamPrepFormat(filteredContent);
      setContentItems(convertedItems);
    }
  }, [content, roomId]);

  // Notify parent component about selection mode
  useEffect(() => {
    if (onSelectionModeChange) {
      onSelectionModeChange(isOpen && step === 1);
    }
  }, [isOpen, step, onSelectionModeChange]);

  // Effect to reset state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setNumQuestions('25');
      setExamLength('60');
      setQuestionType('Both');
      if (onContentSelectionChange) {
        onContentSelectionChange([]);
      }
    }
  }, [isOpen, onContentSelectionChange]);
  
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
    const allSelected = selectedContentIds.length === contentItems.length;
    const newSelection = allSelected ? [] : contentItems.map(item => item.id);
    if (onContentSelectionChange) {
      onContentSelectionChange(newSelection);
    }
  };

  const handleStartExam = () => {
    const selectedItems = contentItems.filter(item => selectedContentIds.includes(item.id));
    const examConfig = {
      selectedTopics: selectedItems.map(item => item.title),
      numQuestions,
      questionType,
      examLength
    };
    localStorage.setItem('examConfig', JSON.stringify(examConfig));
    
    onClose();
    navigate('/exam-loading');
  };

  const selectedCount = selectedContentIds.length;
  const totalCount = contentItems.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

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
        "bg-card border-border",
        step === 1 ? "z-[60]" : "z-[51]" // Higher z-index for step 1 to appear above overlay
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
            <ExamPrepStepOneRedesigned
              selectedCount={selectedCount}
              totalCount={totalCount}
              isAllSelected={isAllSelected}
              onToggleSelectAll={toggleSelectAll}
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
