
import React, { useState } from 'react';
import { ActionCards } from './ActionCards';
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { PasteContentModal } from './PasteContentModal';
import { toast } from 'sonner';

interface RoomHeroSectionProps {
  title: string;
  description: string;
}

export function RoomHeroSection({
  title,
  description
}: RoomHeroSectionProps) {
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
    toast.success("Your question was submitted");
    console.log("AI query:", value);
  };

  return (
    <div className="w-full px-4 py-6 md:py-8 bg-dashboard-bg">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-dashboard-text mb-6 text-center">
            What do you want to learn today?
          </h2>
          
          <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
        </div>
        
        <div className="mb-6">
          <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
        </div>
        
        {/* Modals */}
        <PasteContentModal 
          isOpen={isPasteModalOpen} 
          onClose={() => setIsPasteModalOpen(false)} 
          onSubmit={handlePasteSubmit} 
        />
      </div>
    </div>
  );
}
