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
    addContentWithFile
  } = useContent();
  const handleAISubmit = async (value: string, files?: File[]) => {
    try {
      // For new chats, navigate directly to new chat route without creating content
      const searchParams = new URLSearchParams();
      if (value.trim()) {
        searchParams.set('query', value);
      }
      if (files && files.length > 0) {
        searchParams.set('hasFiles', 'true');
      }

      // Navigate to new chat route - this will create a fresh conversation
      navigate(`/chat/new?${searchParams.toString()}`);
      toast.success(`Starting conversation with Shattara AI${files && files.length > 0 ? ` with ${files.length} file(s)` : ''}`);
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
        <EnhancedPromptInput onSubmit={handleAISubmit} />
      </motion.div>

      {/* Quick Tips Section with matching subtle styling */}
      
    </div>;
}