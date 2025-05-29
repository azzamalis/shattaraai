
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomHeader } from '@/components/dashboard/RoomHeader';
import { RoomContent } from '@/components/dashboard/RoomContent';
import { AITutorChatDrawer } from '@/components/dashboard/AITutorChatDrawer';
import { ExamPrepModal } from '@/components/dashboard/ExamPrepModal';
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();

  const [room, setRoom] = useState({
    title: 'Untitled Room',
    description: ''
  });

  // State for modals and drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  // Fetch room data when component mounts
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedRoom = {
      title: id === "1" ? "Azzam's Room" : id === "2" ? "Untitled Room" : id === "3" ? "Project 'Neom'" : "Untitled Room",
      description: id === "1" ? "Personal learning space" : id === "2" ? "" : id === "3" ? "Research and development" : ""
    };
    setRoom(fetchedRoom);
  }, [id]);

  const handleRoomUpdate = (updatedRoom: { title: string; description: string }) => {
    setRoom(updatedRoom);
  };

  const handlePasteSubmit = (data: { url?: string; text?: string }) => {
    if (data.url) {
      toast.success("URL content added successfully");
    } else if (data.text) {
      toast.success("Text content added successfully");
    }
    setIsPasteModalOpen(false);
  };

  // Determine if room is empty (you can update this logic based on actual content)
  const isEmpty = id === "physics" || id === "2";

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden bg-dashboard-bg">
        {/* Room Header */}
        <RoomHeader 
          room={room}
          onRoomUpdate={handleRoomUpdate}
          onChatClick={() => setIsChatOpen(true)}
          onExamClick={() => setIsExamModalOpen(true)}
        />
        
        {/* Room Content */}
        <RoomContent 
          isEmpty={isEmpty}
          onPasteClick={() => setIsPasteModalOpen(true)}
        />
        
        {/* Modals and Drawers */}
        <AITutorChatDrawer open={isChatOpen} onOpenChange={setIsChatOpen} />
        <ExamPrepModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} />
        <PasteContentModal 
          isOpen={isPasteModalOpen} 
          onClose={() => setIsPasteModalOpen(false)} 
          onSubmit={handlePasteSubmit} 
        />
      </div>
    </DashboardLayout>
  );
}
