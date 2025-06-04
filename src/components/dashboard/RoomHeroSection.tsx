import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCards } from './ActionCards';
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { PasteContentModal } from './PasteContentModal';
import { toast } from 'sonner';
import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';

interface RoomHeroSectionProps {
  title: string;
  description: string;
}

export function RoomHeroSection({
  title,
  description
}: RoomHeroSectionProps) {
  const navigate = useNavigate();
  const { onAddContent } = useContent();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const handlePasteSubmit = (data: {
    url?: string;
    text?: string;
  }) => {
    if (data.url) {
      toast.success("URL content added successfully");
    } else if (data.text) {
      toast.success("Text content added successfully");
    }
    setIsPasteModalOpen(false);
  };

  const handleAISubmit = (value: string) => {
    const contentId = onAddContent({
      title: 'Chat with Shattara AI',
      type: 'chat',
      text: value
    });

    const searchParams = new URLSearchParams({
      query: value
    });
    navigate(`/chat/${contentId}?${searchParams.toString()}`);
    toast.success("Starting conversation with Shattara AI");
  };

  return (
    <div className="w-full bg-background">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            What do you need help understanding today?
          </h2>
          <p className="text-muted-foreground text-lg">
            Ask any question or paste content to get started
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="py-6"
        >
          <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative my-6 sm:my-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-md" />
          <div className="relative">
            <AIChatInput 
              onSubmit={handleAISubmit} 
              initialIsActive={false}
              className="backdrop-blur-[2px]" 
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-primary/30" />
            <span>Try asking about specific topics</span>
            <span className="h-1 w-1 rounded-full bg-primary/30" />
            <span>Paste content for analysis</span>
            <span className="h-1 w-1 rounded-full bg-primary/30" />
            <span>Get detailed explanations</span>
          </div>
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
