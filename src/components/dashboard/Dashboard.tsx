
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, Box } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { toast } from "sonner";
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { ContentCards } from './ContentCards';
import { LearningRooms } from './LearningRooms';
import { ContinueLearning } from './ContinueLearning';

export function Dashboard() {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  
  const handlePasteSubmit = (data: {
    url?: string;
    text?: string;
  }) => {
    if (data.url) {
      toast.success("URL content added successfully");
    } else if (data.text) {
      toast.success("Text content added successfully");
    }
  };
  
  const handleAISubmit = (value: string) => {
    toast.success("Your question was submitted");
    console.log("AI query:", value);
  };
  
  const handleDeleteClick = (roomName: string) => {
    setRoomToDelete(roomName);
    setDeleteModalOpen(true);
  };

  // Sample rooms data
  const rooms = [
    { id: '1', name: "Azzam's Room" },
    { id: '2', name: "Project 'Neom'" },
    { id: '3', name: "Untitled Room" }
  ];
  
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-[#222222]">
        <div className="max-w-6xl mx-auto">
          {/* Practice with exams section - with popover matching profile style */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-transparent hover:bg-white/5 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-white font-medium text-xs px-2 py-0.5 pointer-events-none">
                      NEW
                    </Badge>
                    <span>Practice with exams</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] bg-[#1A1A1A] border border-white/10 text-white p-0" align="center" sideOffset={5}>
                <div className="py-2 px-1">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-400">Choose a Room</div>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-primary/10 hover:!text-white group">
                    <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
                    <span>Azzam's Room</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-primary/10 hover:!text-white group">
                    <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
                    <span>Project 'Neom'</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-primary/10 hover:!text-white group">
                    <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
                    <span>Untitled Room</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Centered main heading with responsive font size */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-12 text-center">What do you want to learn today?</h1>
          
          {/* Content Cards Section */}
          <ContentCards onPasteClick={() => setIsPasteModalOpen(true)} />
          
          {/* AI Assistant Input with enhanced animation */}
          <div className="mb-6 sm:mb-8">
            <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
          </div>

          {/* My Rooms section */}
          <LearningRooms 
            rooms={rooms} 
            onDeleteRoom={handleDeleteClick} 
          />

          {/* Continue learning section */}
          <ContinueLearning 
            onShare={() => toast.success("Sharing dialog opened")} 
            onDelete={() => toast.success("Content deleted")} 
          />
        </div>
      </main>

      {/* Paste Content Modal */}
      <PasteContentModal 
        isOpen={isPasteModalOpen} 
        onClose={() => setIsPasteModalOpen(false)} 
        onSubmit={handlePasteSubmit} 
      />
    </div>
  );
}
