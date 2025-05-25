
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
        <SheetContent side="left" className={`${getDrawerWidth()} bg-dashboard-bg dark:bg-dashboard-bg p-0 flex flex-col`} closeButton={false}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-dashboard-bg dark:bg-dashboard-bg shrink-0">
            <div className="flex items-center gap-2">
              <Logo className="h-8 md:h-10 w-auto" textColor="text-dashboard-text dark:text-dashboard-text" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-dashboard-text dark:text-dashboard-text hover:text-dashboard-text dark:hover:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover">
              <ChevronsLeft size={22} />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-8 pb-6">
              {/* New Content Button */}
              <div className="px-2">
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-center gap-2 
                    bg-transparent border border-dashed border-dashboard-separator dark:border-dashboard-separator 
                    text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text
                    transition-colors duration-200 rounded-md py-2" 
                  onClick={() => {
                    navigate('/dashboard');
                    onOpenChange(false);
                  }}
                >
                  <Plus size={18} />
                  <span>Add content</span>
                </Button>
              </div>
              
              {/* History Section */}
              <HistorySection />
              
              {/* Rooms Section */}
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
              
              {/* Help Tools Section */}
              <HelpTools 
                onTutorialClick={handleTutorialClick} 
                onFeedbackClick={handleFeedbackClick} 
                onCalculatorClick={() => setCalculatorModalOpen(true)} 
              />
            </div>
          </ScrollArea>

          {/* User Profile */}
          <UserProfile onOpenChange={onOpenChange} />
        </SheetContent>
      </Sheet>

      <FeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
      <TutorialModal open={tutorialModalOpen} onOpenChange={setTutorialModalOpen} />
      <CalculatorModal open={calculatorModalOpen} onOpenChange={setCalculatorModalOpen} />

      <DeleteRoomModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} roomName={roomToDeleteName} onConfirm={handleDeleteConfirm} />
    </>
  );
}
