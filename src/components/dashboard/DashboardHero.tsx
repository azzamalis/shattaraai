
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { AIChatInput } from '@/components/ui/ai-chat-input';
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
    addContentWithFile
  } = useContent();

  const handleAISubmit = async (value: string, files?: File[]) => {
    let contentId: string | null = null;

    try {
      // If files are attached, handle them first
      if (files && files.length > 0) {
        for (const file of files) {
          const contentType = file.type === 'application/pdf' ? 'pdf' : 'upload';
          
          const fileContentId = await addContentWithFile({
            title: file.name,
            type: contentType,
            room_id: null,
            metadata: {
              originalName: file.name,
              fileSize: file.size,
              fileType: file.type
            }
          }, file);

          if (!contentId) {
            contentId = fileContentId;
          }
        }
      }

      // Create chat content with the query
      if (value.trim()) {
        const chatContentId = await onAddContent({
          title: 'Chat with Shattara AI',
          type: 'chat',
          room_id: null,
          metadata: {
            hasAttachments: files && files.length > 0,
            attachmentCount: files ? files.length : 0
          },
          text_content: value
        });

        if (!contentId) {
          contentId = chatContentId;
        }
      }

      // Navigate to chat page
      if (contentId) {
        const searchParams = new URLSearchParams();
        if (value.trim()) {
          searchParams.set('query', value);
        }
        if (files && files.length > 0) {
          searchParams.set('hasFiles', 'true');
        }
        
        navigate(`/chat/${contentId}?${searchParams.toString()}`);
        toast.success(`Starting conversation with Shattara AI${files && files.length > 0 ? ` with ${files.length} file(s)` : ''}`);
      }
    } catch (error) {
      console.error('Error handling AI submit:', error);
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
        <div className="relative">
          <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
        </div>
      </motion.div>

      {/* Quick Tips Section with matching subtle styling */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5,
      delay: 0.6
    }} className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-1 w-1 rounded-full bg-primary/30" />
          <span>Try asking about specific topics</span>
          <span className="h-1 w-1 rounded-full bg-primary/30" />
          <span>Attach PDFs or images for analysis</span>
          <span className="h-1 w-1 rounded-full bg-primary/30" />
          <span>Get detailed explanations</span>
        </div>
      </motion.div>
    </div>;
}
