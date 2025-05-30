
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Logo from '@/components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronsLeft } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { TutorialModal } from './TutorialModal';
import { CalculatorModal } from './modals/CalculatorModal';
import { RoomsSection } from './drawer/RoomsSection';
import { HistorySection } from './drawer/HistorySection';
import { HelpTools } from './drawer/HelpTools';
import { UserProfile } from './drawer/UserProfile';
import { DeleteRoomModal } from './drawer/DeleteRoomModal';
import { Room } from '@/lib/types';

interface DashboardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
  onAddRoom: () => void;
  onEditRoom: (id: string, newName: string) => void;
  onDeleteRoom: (id: string) => void;
}

export function DashboardDrawer({
  open,
  onOpenChange,
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: DashboardDrawerProps) {
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem('hasSeenTutorial') === 'true';
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [roomToDeleteName, setRoomToDeleteName] = useState<string>("");
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (!tutorialModalOpen) {
      setHasSeenTutorial(localStorage.getItem('hasSeenTutorial') === 'true');
    }
  }, [tutorialModalOpen]);
  
  const handleFeedbackClick = () => {
    console.log("Feedback button clicked");
    setFeedbackModalOpen(true);
  };
  
  const handleTutorialClick = () => {
    console.log("Tutorial button clicked");
    setTutorialModalOpen(true);
    setHasSeenTutorial(true);
    localStorage.setItem('hasSeenTutorial', 'true');
  };
  
  const getDrawerWidth = () => {
    if (windowWidth < 640) return 'w-[85vw]';
    if (windowWidth < 768) return 'w-[350px]';
    return 'w-[300px]';
  };
  
  const handleDeleteConfirm = () => {
    if (roomToDelete) {
      onDeleteRoom(roomToDelete);
      setRoomToDelete(null);
      setDeleteModalOpen(false);
    }
  };
  
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="left" 
          className={`${getDrawerWidth()} bg-background p-0 flex flex-col border-r border-border`} 
          closeButton={false}
        >
          {/* Enhanced Header */}
          <div className="flex items-center justify-between px-8 py-6 bg-background shrink-0">
            <div className="flex items-center gap-3">
              <Logo className="h-8 md:h-10 w-auto" textColor="text-foreground" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className="text-foreground hover:text-foreground hover:bg-accent rounded-full"
            >
              <ChevronsLeft size={22} />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-12 pt-2">
              {/* Add Content Button */}
              <div className="px-6">
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-center gap-3 
                    bg-transparent border border-dashed border-border 
                    text-foreground hover:bg-accent hover:text-foreground
                    transition-colors duration-200 rounded-md py-3" 
                  onClick={() => {
                    navigate('/dashboard');
                    onOpenChange(false);
                  }}
                >
                  <Plus size={20} />
                  <span className="font-medium">Add content</span>
                </Button>
              </div>
              
              {/* History Section */}
              <div className="px-6">
                <HistorySection />
              </div>
              
              {/* Rooms Section */}
              <div className="px-6">
                <RoomsSection 
                  rooms={rooms} 
                  onAddRoom={onAddRoom} 
                  onEditRoom={onEditRoom} 
                  onDeleteRoom={onDeleteRoom} 
                  onOpenChange={onOpenChange} 
                  setRoomToDelete={setRoomToDelete} 
                  setRoomToDeleteName={setRoomToDeleteName} 
                  setDeleteModalOpen={setDeleteModalOpen} 
                />
              </div>
              
              {/* Help Tools Section */}
              <div className="px-6">
                <HelpTools 
                  onTutorialClick={handleTutorialClick} 
                  onFeedbackClick={handleFeedbackClick} 
                  onCalculatorClick={() => setCalculatorModalOpen(true)} 
                />
              </div>
            </div>
          </ScrollArea>

          {/* Enhanced User Profile */}
          <div className="mt-auto">
            <div className="px-6 py-4">
              <UserProfile onOpenChange={onOpenChange} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <FeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
      <TutorialModal open={tutorialModalOpen} onOpenChange={setTutorialModalOpen} />
      <CalculatorModal open={calculatorModalOpen} onOpenChange={setCalculatorModalOpen} />
      <DeleteRoomModal 
        open={deleteModalOpen} 
        onOpenChange={setDeleteModalOpen} 
        roomName={roomToDeleteName} 
        onConfirm={handleDeleteConfirm} 
      />
    </>
  );
}
