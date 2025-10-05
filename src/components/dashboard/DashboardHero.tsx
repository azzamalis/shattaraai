import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { EnhancedPromptInput } from '@/components/ui/enhanced-prompt-input';
import { NewFeaturePromo } from './NewFeaturePromo';
import { ActionCards } from './ActionCards';
import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';
interface DashboardHeroProps {
  onPasteClick: () => void;
}
export function DashboardHero({
  onPasteClick
}: DashboardHeroProps) {
  const navigate = useNavigate();
  const {
    onAddContent,
    addContentWithFile,
    onAddContentWithMetadata
  } = useContent();
  const handleAISubmit = async (value: string, files?: File[]) => {
    try {
      // Create content entry FIRST with initial query as title
      const title = value.slice(0, 100) + (value.length > 100 ? '...' : '');
      
      const { onAddContentWithMetadata } = useContent();
      const contentId = await onAddContentWithMetadata({
        title: title,
        type: 'chat',
        text_content: value,
        room_id: null,
        processing_status: 'pending',
        metadata: {
          initialQuery: value,
          hasAttachments: files && files.length > 0,
          attachmentCount: files?.length || 0,
          createdFrom: 'dashboard_hero'
        }
      });

      if (contentId) {
        // Navigate with content ID and initial query
        const searchParams = new URLSearchParams();
        searchParams.set('query', value);
        if (files && files.length > 0) {
          searchParams.set('hasFiles', 'true');
        }
        
        navigate(`/chat/${contentId}?${searchParams.toString()}`);
        toast.success('Starting conversation with Shattara AI');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start conversation');
    }
  };
  return <div className="max-w-[800px] mx-auto mb-12">
      <NewFeaturePromo />
      
      <motion.h1 initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8 md:mb-12 text-center font-normal md:text-3xl">What do you need help learning?</motion.h1>
      
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <ActionCards onPasteClick={onPasteClick} />
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

      {/* Quick Tips Section with matching subtle styling */}
      
    </div>;
}