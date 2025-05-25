
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
        <SheetContent side="left" className={`${getDrawerWidth()} bg-dashboard-sidebar p-0`} closeButton={false}>
          <div className="flex items-center justify-between p-4 bg-dashboard-sidebar">
            <div className="flex items-center gap-2">
              <Logo className="h-8 md:h-10 w-auto" textColor="text-dashboard-text" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-dashboard-text hover:text-dashboard-text hover:bg-dashboard-card-hover">
              <ChevronsLeft size={22} />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <div className="flex flex-col h-[calc(100%-130px)] overflow-auto bg-dashboard-sidebar">
            <div className="px-4 pt-4 pb-6">
              <Button className="w-full flex items-center justify-center gap-2 
                  bg-primary text-white hover:bg-primary/90 
                  transition-colors duration-200" onClick={() => {
                navigate('/dashboard');
                onOpenChange(false);
              }}>
                <Plus size={18} />
                <span>New Content</span>
              </Button>
            </div>
            
            <HistorySection />
            
            <RoomsSection rooms={rooms} onAddRoom={onAddRoom} onEditRoom={onEditRoom} onDeleteRoom={onDeleteRoom} onOpenChange={onOpenChange} setRoomToDelete={setRoomToDelete} setRoomToDeleteName={setRoomToDeleteName} setDeleteModalOpen={setDeleteModalOpen} />
            
            <HelpTools onTutorialClick={handleTutorialClick} onFeedbackClick={handleFeedbackClick} onCalculatorClick={() => setCalculatorModalOpen(true)} />
          </div>

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
