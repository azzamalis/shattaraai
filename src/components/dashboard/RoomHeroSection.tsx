import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCards } from './ActionCards';
import { EnhancedPromptInput } from '@/components/ui/enhanced-prompt-input';
import { PasteContentModal } from './PasteContentModal';
import { ExamPrepStepOneRedesigned } from './exam-prep/ExamPrepStepOneRedesigned';
import { toast } from 'sonner';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
interface RoomHeroSectionProps {
  title: string;
  description: string;
  // Exam prep props
  isExamMode?: boolean;
  examModeData?: {
    roomId?: string;
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
  const { user } = useAuth();
  const {
    onAddContent,
    onAddContentWithMetadata
  } = useContent();
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
    // For YouTube/website content, store metadata in appropriate storage bucket
    const contentData = {
      title,
      type: contentType as any,
      room_id: null,
      metadata: {},
      url: data.url,
      text_content: data.text
    };

    const metadata = data.url ? { url: data.url, extractedAt: new Date().toISOString() } : undefined;
    const contentId = await onAddContentWithMetadata(contentData, metadata);
    if (contentId) {
      const searchParams = new URLSearchParams({
        type: contentType,
        ...(data.url && {
          url: data.url
        }),
        ...(data.text && {
          text: data.text
        })
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
  const handleAISubmit = async (value: string, files?: File[]) => {
    try {
      // Upload files to storage first if present
      const uploadedFiles: Array<{
        name: string;
        type: string;
        size: number;
        url: string;
        uploadedAt: string;
      }> = [];

      if (files && files.length > 0) {
        const { uploadFileToStorage } = await import('@/lib/storage');
        
        for (const file of files) {
          try {
            const fileUrl = await uploadFileToStorage(file, 'chat', user.id);
            uploadedFiles.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: fileUrl,
              uploadedAt: new Date().toISOString()
            });
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
      }

      const title = value.slice(0, 100) + (value.length > 100 ? '...' : '');
      
      const contentId = await onAddContentWithMetadata({
        title: title,
        type: 'chat',
        text_content: value,
        room_id: examModeData?.roomId || null,
        processing_status: 'pending',
        metadata: {
          initialQuery: value,
          roomContext: true,
          roomId: examModeData?.roomId,
          hasAttachments: uploadedFiles.length > 0,
          attachmentCount: uploadedFiles.length,
          attachments: uploadedFiles,
          createdFrom: 'room_hero'
        }
      });

      if (contentId) {
        const searchParams = new URLSearchParams();
        searchParams.set('query', value);
        if (uploadedFiles.length > 0) {
          searchParams.set('hasFiles', 'true');
        }
        
        navigate(`/chat/${contentId}?${searchParams.toString()}`);
        toast.success('Starting conversation in room');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start conversation');
    }
  };

  // Calculate progress percentage based on current step
  const getProgressValue = () => {
    return examStep / 3 * 100;
  };
  const getStepLabel = () => {
    switch (examStep) {
      case 1:
        return 'Select Content';
      case 2:
        return 'AI Tutor Setup';
      case 3:
        return 'Exam Configuration';
      default:
        return 'Select Content';
    }
  };

  // Render exam prep mode
  if (isExamMode && examModeData) {
    return (
      <div className="w-full bg-background">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <ExamPrepStepOneRedesigned 
              selectedCount={examModeData.selectedCount} 
              totalCount={examModeData.totalCount} 
              isAllSelected={examModeData.isAllSelected} 
              onToggleSelectAll={examModeData.onToggleSelectAll} 
              onNext={examModeData.onNext}
              currentStep={examStep}
              totalSteps={3}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // Render default hero content
  return <div className="w-full bg-background">
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
          <h2 className="text-2xl text-foreground mb-4 font-normal sm:text-3xl">What do you need help learning?</h2>
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
          <EnhancedPromptInput onSubmit={handleAISubmit} />
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
        
        <PasteContentModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onSubmit={handlePasteSubmit} />
      </div>
    </div>;
}