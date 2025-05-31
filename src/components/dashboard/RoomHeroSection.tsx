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
    <div className="w-full bg-background">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
            What do you need help understanding today?
          </h2>
          
          <div className="py-4">
            <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
          </div>
        </div>
        
        <div>
          <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
        </div>
        
        <PasteContentModal 
          isOpen={isPasteModalOpen} 
          onClose={() => setIsPasteModalOpen(false)} 
          onSubmit={handlePasteSubmit} 
        />
      </div>
    </div>
  );
}
