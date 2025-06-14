
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
import { AITutorChatDrawer } from '@/components/dashboard/AITutorChatDrawer';
import { ExamPrepModal } from '@/components/dashboard/ExamPrepModal';
import { useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { useContent } from '@/hooks/useContent';

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { rooms, loading: roomsLoading } = useRooms();
  const { content, loading: contentLoading } = useContent();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Find the current room from the database
  const currentRoom = rooms.find(room => room.id === id);
  
  // Filter content for this room
  const roomContent = content.filter(item => item.room_id === id);

  // Handle exam modal trigger from exam summary
  useEffect(() => {
    if (location.state?.openExamModal) {
      setIsExamModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Store room ID when entering the room
  useEffect(() => {
    if (id) {
      localStorage.setItem('currentRoomId', id);
    }
  }, [id]);

  const handleTitleEdit = () => {
    setEditedTitle(currentRoom?.name || 'Untitled Room');
    setIsEditingTitle(true);
  };

  const handleDescriptionEdit = () => {
    setEditedDescription(''); // Rooms don't have descriptions in the DB yet
    setIsEditingDescription(true);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      // TODO: Implement room update functionality
      toast.success("Room title updated successfully");
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    // TODO: Implement room description update functionality
    toast.success("Room description updated successfully");
    setIsEditingDescription(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
  };

  const handleDescriptionCancel = () => {
    setIsEditingDescription(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDescriptionSave();
    } else if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  const handleClickOutside = () => {
    if (isEditingTitle) {
      handleTitleCancel();
    }
    if (isEditingDescription) {
      handleDescriptionCancel();
    }
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

  const roomTitle = currentRoom.name;
  const roomDescription = ''; // Rooms don't have descriptions in DB yet

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background" onClick={handleClickOutside}>
        <div className="py-12">
          <RoomHeroSection title={roomTitle} description={roomDescription} />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="group">
                      <div className="flex items-center gap-3 mb-2">
                        {isEditingTitle ? (
                          <input 
                            type="text" 
                            value={editedTitle} 
                            onChange={e => setEditedTitle(e.target.value)} 
                            onKeyDown={handleTitleKeyDown} 
                            onClick={e => e.stopPropagation()} 
                            className="text-2xl font-bold text-foreground bg-transparent border-none outline-none focus:ring-0 p-0 w-full" 
                            placeholder="Untitled Room" 
                            autoFocus 
                          />
                        ) : (
                          <>
                            <h1 className="font-bold text-foreground text-xl">{roomTitle}</h1>
                            <button 
                              onClick={e => {
                                e.stopPropagation();
                                handleTitleEdit();
                              }} 
                              className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all duration-200"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                      
                      {isEditingDescription ? (
                        <input 
                          type="text" 
                          value={editedDescription} 
                          onChange={e => setEditedDescription(e.target.value)} 
                          onKeyDown={handleDescriptionKeyDown} 
                          onClick={e => e.stopPropagation()} 
                          className="text-muted-foreground bg-transparent border-none outline-none focus:ring-0 p-0 w-full" 
                          placeholder="Add a description" 
                          autoFocus 
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-muted-foreground text-base">
                            {roomDescription || "No description"}
                          </p>
                          <button 
                            onClick={e => {
                              e.stopPropagation();
                              handleDescriptionEdit();
                            }} 
                            className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all duration-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button 
                      className="bg-foreground hover:bg-foreground/90 text-background hover:text-background transition-all duration-200 hover:shadow-sm" 
                      onClick={e => {
                        e.stopPropagation();
                        setIsChatOpen(true);
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Room Chat
                    </Button>
                    <Button 
                      className="bg-foreground hover:bg-foreground/90 text-background hover:text-background transition-all duration-200 hover:shadow-sm" 
                      onClick={e => {
                        e.stopPropagation();
                        setIsExamModalOpen(true);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Create Exam
                    </Button>
                  </div>
                </div>

                <div className="w-full h-px bg-border" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <RoomView 
              title={roomTitle} 
              description={roomDescription} 
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
