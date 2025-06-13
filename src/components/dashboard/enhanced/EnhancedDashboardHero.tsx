
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { NewFeaturePromo } from '../NewFeaturePromo';
import { ActionCards } from '../ActionCards';
import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Sparkles, Brain, FileText } from 'lucide-react';

interface EnhancedDashboardHeroProps {
  onPasteClick: () => void;
}

export function EnhancedDashboardHero({ onPasteClick }: EnhancedDashboardHeroProps) {
  const navigate = useNavigate();
  const { onAddContent } = useContent();

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
    <div className="max-w-[900px] mx-auto mb-16">
      <NewFeaturePromo />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <Sparkles className="h-4 w-4" />
          AI-Powered Learning Assistant
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          What do you need help{' '}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            understanding
          </span>{' '}
          today?
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upload content, ask questions, or start a conversation with our AI tutor
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <ActionCards onPasteClick={onPasteClick} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-xl" />
        <div className="relative">
          <AIChatInput 
            onSubmit={handleAISubmit} 
            initialIsActive={false}
            className="backdrop-blur-sm shadow-lg border-primary/20" 
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span>AI-powered explanations</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span>Upload any content</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Instant insights</span>
        </div>
      </motion.div>
    </div>
  );
}
