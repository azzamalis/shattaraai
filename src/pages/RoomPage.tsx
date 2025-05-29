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

export default function RoomPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();

  const location = useLocation();

  // State for editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [room, setRoom] = useState({
    title: 'Untitled Room',
    description: ''
  });

  // State for AI Tutor Chat drawer
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // State for Exam Prep modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Fetch room data when component mounts
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate some room data
    const fetchedRoom = {
      title: id === "1" ? "Azzam's Room" : id === "2" ? "Untitled Room" : id === "3" ? "Project 'Neom'" : "Untitled Room",
      description: id === "1" ? "Personal learning space" : id === "2" ? "" : id === "3" ? "Research and development" : ""
    };
    setRoom(fetchedRoom);
  }, [id]);

  // Handle exam modal trigger from exam summary
  useEffect(() => {
    if (location.state?.openExamModal) {
      setIsExamModalOpen(true);
      // Clear the state to prevent modal from reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Store room ID when entering the room
  useEffect(() => {
    localStorage.setItem('currentRoomId', id);
  }, [id]);

  // Initialize edited values when entering edit mode
  const handleTitleEdit = () => {
    setEditedTitle(room.title);
    setIsEditingTitle(true);
  };

  const handleDescriptionEdit = () => {
    setEditedDescription(room.description);
    setIsEditingDescription(true);
  };
  
  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      setRoom(prev => ({
        ...prev,
        title: editedTitle.trim()
      }));
      toast.success("Room title updated successfully");
    } else {
      setRoom(prev => ({
        ...prev,
        title: "Untitled Room"
      }));
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    setRoom(prev => ({
      ...prev,
      description: editedDescription.trim()
    }));
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

  // Handle click outside to cancel editing
  const handleClickOutside = () => {
    if (isEditingTitle) {
      handleTitleCancel();
    }
    if (isEditingDescription) {
      handleDescriptionCancel();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden bg-dashboard-bg" onClick={handleClickOutside}>
        {/* Hero Section at the top */}
        <RoomHeroSection title={room.title} description={room.description} />
        
        {/* Room Title, Description and Action Buttons */}
        <div className="px-4 py-8 bg-dashboard-bg">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="group">
                    <div className="flex items-center gap-3 mb-2">
                      {isEditingTitle ? (
                        <input 
                          type="text" 
                          value={editedTitle} 
                          onChange={e => setEditedTitle(e.target.value)} 
                          onKeyDown={handleTitleKeyDown}
                          onClick={e => e.stopPropagation()}
                          className="text-2xl font-bold text-dashboard-text bg-transparent border-none outline-none focus:ring-0 p-0 w-full" 
                          placeholder="Untitled Room" 
                          autoFocus 
                        />
                      ) : (
                        <>
                          <h1 className="text-2xl font-bold text-dashboard-text">{room.title}</h1>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTitleEdit();
                            }}
                            className="p-1.5 text-dashboard-text/30 opacity-0 group-hover:opacity-100 hover:text-dashboard-text/70 transition-all duration-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {isEditingDescription ? (
                        <input 
                          type="text" 
                          value={editedDescription} 
                          onChange={e => setEditedDescription(e.target.value)} 
                          onKeyDown={handleDescriptionKeyDown}
                          onClick={e => e.stopPropagation()}
                          className="text-dashboard-text-secondary bg-transparent border-none outline-none focus:ring-0 p-0 w-full" 
                          placeholder="Add a description" 
                          autoFocus 
                        />
                      ) : (
                        <>
                          <p className="text-dashboard-text-secondary">
                            {room.description || "No description"}
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDescriptionEdit();
                            }}
                            className="p-1.5 text-dashboard-text/30 opacity-0 group-hover:opacity-100 hover:text-dashboard-text/70 transition-all duration-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <Button 
                  variant="outline" 
                  className="
                    bg-transparent hover:bg-transparent
                    text-[#121212] hover:text-[#121212]
                    border-[#0A0A0A] hover:border-[#0A0A0A]
                    dark:text-[#FAFAFA] dark:hover:text-[#FAFAFA]
                    dark:border-[#232323] dark:hover:border-[#232323]
                    transition-all duration-200
                    hover:shadow-sm
                  "
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChatOpen(true);
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Room Chat
                </Button>
                <Button 
                  className="
                    bg-[#0A0A0A] hover:bg-[#0A0A0A]/90
                    text-[#FAFAFA] hover:text-[#FAFAFA]
                    dark:bg-[#FAFAFA] dark:hover:bg-[#FAFAFA]/90
                    dark:text-[#171717] dark:hover:text-[#171717]
                    transition-all duration-200
                    hover:shadow-sm
                  "
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExamModalOpen(true);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Create Exam
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Room Content */}
        <RoomView title={room.title} description={room.description} isEmpty={id === "physics"} hideHeader={true} />
        
        {/* AI Tutor Chat Drawer */}
        <AITutorChatDrawer open={isChatOpen} onOpenChange={setIsChatOpen} />
        
        {/* Exam Prep Modal */}
        <ExamPrepModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
