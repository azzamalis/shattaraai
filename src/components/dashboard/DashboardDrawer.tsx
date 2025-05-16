
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { FeedbackModal } from './FeedbackModal';
import { TutorialModal } from './TutorialModal';
import { DrawerHeader } from './DrawerHeader';
import { DrawerContent } from './DrawerContent';
import { DrawerFooter } from './DrawerFooter';

interface DashboardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardDrawer({
  open,
  onOpenChange
}: DashboardDrawerProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem('hasSeenTutorial') === 'true';
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update the hasSeenTutorial state when the tutorial modal is closed
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
    
    // After opening the tutorial, we can consider it as "seen" for the notification dot
    setHasSeenTutorial(true);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  // Determine drawer width based on screen size
  const getDrawerWidth = () => {
    if (windowWidth < 640) return 'w-[85vw]';
    if (windowWidth < 768) return 'w-[350px]';
    return 'w-[300px]';
  };

  return <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className={`${getDrawerWidth()} bg-[#222222] border-r border-white/20 p-0`} 
        closeButton={false}
      >
        <DrawerHeader onClose={() => onOpenChange(false)} />
        <DrawerContent 
          onFeedbackClick={handleFeedbackClick}
          onTutorialClick={handleTutorialClick}
          hasSeenTutorial={hasSeenTutorial}
        />
        <DrawerFooter 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </SheetContent>
    </Sheet>

    {/* Modals */}
    <FeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
    <TutorialModal open={tutorialModalOpen} onOpenChange={setTutorialModalOpen} />
  </>;
}
