import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCards } from './ActionCards';
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { PasteContentModal } from './PasteContentModal';
import { ExamPrepStepOneRedesigned } from './exam-prep/ExamPrepStepOneRedesigned';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';

interface RoomHeroSectionProps {
  title: string;
  description: string;
  // Exam prep props
  isExamMode?: boolean;
  examModeData?: {
    selectedCount: number;
    totalCount: number;
    isAllSelected: boolean;
    onToggleSelectAll: () => void;
    onNext: () => void;
    onCancel: () => void;
  };
  // Add exam step prop for progress calculation
  examStep?: number;
}

export function RoomHeroSection({
  title,
  description,
  isExamMode = false,
  examModeData,
  examStep = 1
}: RoomHeroSectionProps) {
  const navigate = useNavigate();
  const { onAddContent } = useContent();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const handlePasteSubmit = async (data: {
    url?: string;
    text?: string;
  }) => {
    // Determine content type based on URL
    let contentType = 'text';
    let title = 'Text Content';
    if (data.url) {
      if (data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
        contentType = 'youtube';
        title = 'YouTube Video';
      } else {
        contentType = 'website';
        title = 'Website Content';
      }
    }

    // Add content WITHOUT automatic room assignment
    const contentId = await onAddContent({
      title,
      type: contentType as any,
      room_id: null,
      metadata: {},
      url: data.url,
      text_content: data.text
    });

    if (contentId) {
      const searchParams = new URLSearchParams({
        type: contentType,
        ...(data.url && { url: data.url }),
        ...(data.text && { text: data.text })
      });
      navigate(`/content/${contentId}?${searchParams.toString()}`);
      if (data.url) {
        toast.success("URL content added successfully");
      } else if (data.text) {
        toast.success("Text content added successfully");
      }
    }
    setIsPasteModalOpen(false);
  };

  const handleAISubmit = async (value: string) => {
    // Create chat content WITHOUT automatic room assignment
    const contentId = await onAddContent({
      title: 'Chat with Shattara AI',
      type: 'chat',
      room_id: null,
      metadata: {},
      text_content: value
    });

    if (contentId) {
      const searchParams = new URLSearchParams({
        query: value
      });
      navigate(`/chat/${contentId}?${searchParams.toString()}`);
      toast.success("Starting conversation with Shattara AI");
    }
  };

  // Calculate progress percentage based on current step
  const getProgressValue = () => {
    return (examStep / 3) * 100;
  };

  const getStepLabel = () => {
    switch (examStep) {
      case 1: return 'Select Content';
      case 2: return 'AI Tutor Setup';
      case 3: return 'Exam Configuration';
      default: return 'Select Content';
    }
  };

  // Render exam prep mode
  if (isExamMode && examModeData) {
    return (
      <div className="w-full bg-background">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 bg-dashboard-secondary-card rounded-lg shadow-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Step {examStep} of 3</span>
                <span className="text-sm text-muted-foreground">{getStepLabel()}</span>
              </div>
              <Progress value={getProgressValue()} className="h-2" />
            </div>

            <ExamPrepStepOneRedesigned
              selectedCount={examModeData.selectedCount}
              totalCount={examModeData.totalCount}
              isAllSelected={examModeData.isAllSelected}
              onToggleSelectAll={examModeData.onToggleSelectAll}
              onNext={examModeData.onNext}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // Render default hero content
  return (
    <div className="w-full bg-background">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            What do you need help understanding today?
          </h2>
          <p className="text-muted-foreground text-lg">Ask any question or add content to get started</p>
        </motion.div>
        
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="py-6">
          <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
        </motion.div>
        
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="relative my-6 sm:my-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-md" />
          <div className="relative">
            <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} className="backdrop-blur-[2px]" />
          </div>
        </motion.div>

        <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.6
        }} className="mt-8 text-center">
          
        </motion.div>
        
        <PasteContentModal 
          isOpen={isPasteModalOpen} 
          onClose={() => setIsPasteModalOpen(false)} 
          onSubmit={handlePasteSubmit} 
        />
      </div>
    </div>
  );
}
