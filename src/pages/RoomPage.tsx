
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
import { RoomPageHeader } from '@/components/dashboard/RoomPageHeader';
import { RoomPageActions } from '@/components/dashboard/RoomPageActions';
import { AITutorChatDrawer } from '@/components/dashboard/AITutorChatDrawer';
import { ExamPrepModal } from '@/components/dashboard/ExamPrepModal';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { useContent } from '@/hooks/useContent';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const { rooms, loading: roomsLoading, editRoom } = useRooms();
  const { content, loading: contentLoading } = useContent();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Find the current room from the database
  const currentRoom = rooms.find(room => room.id === roomId);
  
  // Filter content for this room
  const roomContent = content.filter(item => item.room_id === roomId);

  // Handle exam modal trigger from exam summary
  useEffect(() => {
    if (location.state?.openExamModal) {
      setIsExamModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Store room ID when entering the room
  useEffect(() => {
    if (roomId) {
      localStorage.setItem('currentRoomId', roomId);
    }
  }, [roomId]);

  const handleTitleEdit = async (newTitle: string) => {
    if (currentRoom) {
      try {
        await editRoom(currentRoom.id, newTitle, currentRoom.description);
      } catch (error) {
        console.error('Error updating room title:', error);
        toast.error('Failed to update room title');
      }
    }
  };

  const handleDescriptionEdit = async (newDescription: string) => {
    if (currentRoom) {
      try {
        await editRoom(currentRoom.id, currentRoom.name, newDescription);
      } catch (error) {
        console.error('Error updating room description:', error);
        toast.error('Failed to update room description');
      }
    }
  };

  const handleClickOutside = () => {
    // This function is passed to header for click outside handling
  };

  // Loading state
  if (roomsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading room...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Room not found
  if (!currentRoom) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Room not found</h2>
            <p className="text-muted-foreground">The room you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background">
        <div className="py-12">
          <RoomHeroSection title={currentRoom.name} description={currentRoom.description || ''} />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <RoomPageHeader 
                    room={currentRoom}
                    onTitleEdit={handleTitleEdit}
                    onDescriptionEdit={handleDescriptionEdit}
                    onClickOutside={handleClickOutside}
                  />

                  <RoomPageActions 
                    onChatOpen={() => setIsChatOpen(true)}
                    onExamModalOpen={() => setIsExamModalOpen(true)}
                  />
                </div>

                <div className="w-full h-px bg-border" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <RoomView 
              title={currentRoom.name} 
              description={currentRoom.description || ''} 
              isEmpty={roomContent.length === 0} 
              hideHeader={true} 
            />
          </div>
        </div>
        
        <AITutorChatDrawer open={isChatOpen} onOpenChange={setIsChatOpen} />
        <ExamPrepModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
