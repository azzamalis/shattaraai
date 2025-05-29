
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomHeader } from '@/components/dashboard/RoomHeader';
import { RoomContent } from '@/components/dashboard/RoomContent';
import { AITutorChatDrawer } from '@/components/dashboard/AITutorChatDrawer';
import { ExamPrepModal } from '@/components/dashboard/ExamPrepModal';
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { ActionCards } from '@/components/dashboard/ActionCards';
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
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {/* What do you want to learn today section */}
          <div className="text-center py-12 bg-dashboard-bg">
            <h2 className="text-2xl font-semibold text-dashboard-text mb-8">
              What do you want to learn today?
            </h2>
            <div className="max-w-4xl mx-auto px-6">
              <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
            </div>
            
            {/* AI Chat Section */}
            <div className="mt-8">
              <div className="max-w-md mx-auto">
                <div className="flex items-center gap-3 bg-dashboard-card border border-dashboard-separator rounded-lg p-4">
                  <span className="text-dashboard-text-secondary">Or ask AI tutor</span>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="ml-auto p-2 bg-dashboard-text-secondary rounded-full hover:bg-dashboard-text transition-colors"
                  >
                    <svg className="w-4 h-4 text-dashboard-bg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

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
        </div>
        
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
