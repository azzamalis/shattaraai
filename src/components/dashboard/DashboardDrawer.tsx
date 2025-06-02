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
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 mb-2">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-auto" textColor="text-foreground" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className="text-foreground hover:text-foreground hover:bg-accent rounded-lg h-8 w-8"
            >
              <ChevronsLeft className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="flex flex-col space-y-6 px-3 pt-2">
              {/* Add Content Button */}
              <div className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-start gap-2 
                    bg-transparent border-2 border-dashed border-primary/10 
                    text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/10
                    transition-colors duration-200 rounded-lg py-2 px-2" 
                  onClick={() => {
                    navigate('/dashboard');
                    onOpenChange(false);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Add content</span>
                </Button>
              </div>
              
              {/* History Section */}
              <div className="w-full">
                <HistorySection rooms={rooms} />
              </div>
              
              {/* Rooms Section */}
              <div className="w-full">
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
              <div className="w-full">
                <HelpTools 
                  onTutorialClick={handleTutorialClick} 
                  onFeedbackClick={handleFeedbackClick} 
                  onCalculatorClick={() => setCalculatorModalOpen(true)} 
                />
              </div>
            </div>
          </ScrollArea>

          {/* User Profile */}
          <div className="mt-auto">
            <div className="px-4 py-4">
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
