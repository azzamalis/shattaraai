
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
import { AITutorChatDrawer } from '@/components/dashboard/AITutorChatDrawer';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function RoomPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [room, setRoom] = useState({
    title: 'Untitled Room',
    description: ''
  });

  // State for AI Tutor Chat drawer
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  // Initialize edited values when entering edit mode
  const handleEditClick = () => {
    setEditedTitle(room.title);
    setEditedDescription(room.description);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editedTitle.trim()) {
      // Update the room state
      setRoom({
        title: editedTitle.trim(),
        description: editedDescription.trim()
      });
      toast.success("Room details updated successfully");
      setIsEditing(false);
    } else {
      // If title is empty, revert to "Untitled Room"
      setRoom({
        title: "Untitled Room",
        description: editedDescription.trim()
      });
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Hero Section at the top */}
        <RoomHeroSection title={room.title} description={room.description} />
        
        {/* Room Title, Description and Action Buttons */}
        <div className="px-6 py-6 border-b border-white/10 bg-black">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-start gap-2 flex-1">
              <div className="flex-1 min-w-0">
                {isEditing ? <div className="space-y-2">
                    <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} onKeyDown={handleKeyDown} className="w-full bg-transparent text-2xl font-bold text-white 
                        border-b border-white/20 focus:border-white/40
                        px-0 py-1
                        focus:outline-none focus:ring-0" placeholder="Untitled Room" autoFocus />
                    <input type="text" value={editedDescription} onChange={e => setEditedDescription(e.target.value)} onKeyDown={handleKeyDown} className="w-full bg-transparent text-gray-400
                        border-b border-white/20 focus:border-white/40
                        px-0 py-1
                        focus:outline-none focus:ring-0" placeholder="Add a description" />
                    <div className="flex items-center gap-1 mt-2">
                      <button onClick={handleSave} className="p-1.5 text-white/40 hover:text-white/90 transition-colors duration-200">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="p-1.5 text-white/40 hover:text-white/90 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div> : <div className="group">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-white">{room.title}</h1>
                      <button onClick={handleEditClick} className="p-1.5 text-white/30 opacity-0 group-hover:opacity-100 hover:text-white/70 transition-all duration-200">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-400 mt-1">
                      {room.description || "No description"}
                    </p>
                  </div>}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="outline" 
                className="
                  border-white/10 hover:border-white/20
                  bg-transparent hover:bg-transparent
                  text-white hover:text-white
                  transition-colors duration-200
                  [&:hover>svg]:text-white [&>svg]:text-white
                "
                onClick={() => setIsChatOpen(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Room Chat
              </Button>
              <Button className="
                  bg-[#1a1a1a] hover:bg-[#1a1a1a]
                  text-white
                  border border-transparent hover:border-white/10
                  transition-colors duration-200
                ">
                <FileText className="mr-2 h-4 w-4" />
                Create Exam
              </Button>
            </div>
          </div>
        </div>
        
        {/* Room Content */}
        <RoomView title={room.title} description={room.description} isEmpty={id === "physics"} hideHeader={true} />
        
        {/* AI Tutor Chat Drawer */}
        <AITutorChatDrawer open={isChatOpen} onOpenChange={setIsChatOpen} />
      </div>
    </DashboardLayout>;
}
