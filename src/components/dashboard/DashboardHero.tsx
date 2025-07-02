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
    onAddContent
  } = useContent();
  const handleAISubmit = (value: string) => {
    // Create new chat content
    const contentId = onAddContent({
      title: 'Chat with Shattara AI',
      type: 'chat',
      room_id: null,
      metadata: {},
      text_content: value
    });

    // Navigate to chat page with the query
    const searchParams = new URLSearchParams({
      query: value
    });
    navigate(`/chat/${contentId}?${searchParams.toString()}`);
    toast.success("Starting conversation with Shattara AI");
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
          <span>Paste content for analysis</span>
          <span className="h-1 w-1 rounded-full bg-primary/30" />
          <span>Get detailed explanations</span>
        </div>
      </motion.div>
    </div>;
}