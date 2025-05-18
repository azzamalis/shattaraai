
import React, { useState } from 'react';
import { ActionCards } from './ActionCards';
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText } from 'lucide-react';
import { PasteContentModal } from './PasteContentModal';
import { toast } from 'sonner';

interface RoomHeroSectionProps {
  title: string;
  description: string;
}

export function RoomHeroSection({ title, description }: RoomHeroSectionProps) {
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
    <div className="w-full border-b border-white/10 bg-[#111] px-4 py-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-gray-300 bg-white text-gray-800 hover:bg-white hover:text-primary hover:border-primary">
              <MessageSquare className="mr-2 h-4 w-4" />
              Room Chat
            </Button>
            <Button className="bg-primary hover:bg-primary-light text-white">
              <FileText className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
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
