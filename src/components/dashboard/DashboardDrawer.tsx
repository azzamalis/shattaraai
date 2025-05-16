import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, History, Clock, Box, MessageCircle, Book, Chrome, Settings, Tag, Moon, LogOut, ChevronUp, ChevronsLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { FeedbackModal } from './FeedbackModal';
import { TutorialModal } from './TutorialModal';
import { toast } from 'sonner';

interface DashboardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function DashboardDrawer({
  open,
  onOpenChange
}: DashboardDrawerProps) {
  const navigate = useNavigate();
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

  // Let's add a console log to verify the feedback button click is working
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

  // Add logout handler
  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('hasSeenTutorial');
    // Add any other auth-related cleanup here
    
    // Close the drawer
    onOpenChange(false);
    
    // Show success message
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account."
    });
    
    // Navigate to home page
    navigate('/');
  };

  // Determine drawer width based on screen size
  const getDrawerWidth = () => {
    if (windowWidth < 640) return 'w-[85vw]';
    if (windowWidth < 768) return 'w-[350px]';
    return 'w-[300px]';
  };

  return <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className={`${getDrawerWidth()} bg-[#222222] border-r border-white/20 p-0`} closeButton={false}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Logo className="h-8 md:h-10 w-auto" textColor="text-white" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/10 hover:text-primary">
              <ChevronsLeft size={22} />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Content - Make scrollable for small screens */}
          <div className="flex flex-col h-[calc(100%-130px)] overflow-auto">
            {/* Add Content Button */}
            <div className="px-4 pt-4 pb-2">
              <Button 
                className="w-full justify-start gap-2 bg-primary hover:bg-primary-light text-white"
                onClick={() => {
                  navigate('/dashboard');
                  onOpenChange(false); // Close the drawer after navigation
                }}
              >
                <Plus size={18} />
                <span>Add Content</span>
              </Button>
            </div>
            
            {/* History Section */}
            <div className="px-4 py-2">
              <h3 className="text-white/70 text-xs font-medium mb-2 px-2">History</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                  <Link to="/history">
                    <History size={18} className="mr-2" />
                    <span>History</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                  <Link to="/recent">
                    <Clock size={18} className="mr-2" />
                    <span>Recents</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Rooms Section */}
            <div className="px-4 py-2">
              <h3 className="text-white/70 text-xs font-medium mb-2 px-2">Rooms</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                  <Link to="/rooms/1">
                    <Box size={18} className="mr-2" />
                    <span>Azzam's Room</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                  <Link to="/rooms/2">
                    <Box size={18} className="mr-2" />
                    <span>Untitled Room</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white border border-dashed border-white/20 rounded-md mt-2" asChild>
                  <Link to="/rooms/new">
                    <Plus size={18} className="mr-2" />
                    <span>Add a Room</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Help & Tools Section */}
            <div className="px-4 py-2">
              <h3 className="text-white/70 text-xs font-medium mb-2 px-2">Help & Tools</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" onClick={handleFeedbackClick}>
                  <MessageCircle size={18} className="mr-2" />
                  <span>Feedback</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white relative" onClick={handleTutorialClick}>
                  <Book size={18} className="mr-2" />
                  <span>Quick Guide</span>
                  {!hasSeenTutorial && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  )}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                  <Link to="/extension">
                    <Chrome size={18} className="mr-2" />
                    <span>Chrome Extension</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer with Profile Button and Dropdown */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 p-4 bg-[#222222]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-between w-full text-white hover:bg-white/10 p-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-[#ea384c]">
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden text-left">
                      <p className="truncate text-sm font-medium text-white">Azzam Sahlil</p>
                      <p className="truncate text-xs text-gray-400">Free Plan</p>
                    </div>
                  </div>
                  <ChevronUp size={16} className="text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] bg-[#1A1A1A] border border-white/10 text-white p-0 mb-1 z-50" align="end" side="top" sideOffset={5}>
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-[#ea384c]">
                      <AvatarFallback className="text-black">A</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Azzam Sahlil</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white">
                    <Settings size={16} className="mr-3 text-gray-300" />
                    <span>Settings</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white">
                    <Tag size={16} className="mr-3 text-gray-300" />
                    <span>Pricing</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white">
                    <History size={16} className="mr-3 text-gray-300" />
                    <span>History</span>
                  </Button>
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-white/10">
                    <div className="flex items-center text-white">
                      <Moon size={16} className="mr-3 text-gray-300" />
                      <span>Dark mode</span>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-primary" />
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-3 text-gray-300" />
                    <span>Log out</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </SheetContent>
      </Sheet>

      {/* Render the FeedbackModal outside the Sheet component */}
      <FeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
      
      {/* Render the TutorialModal outside the Sheet component */}
      <TutorialModal open={tutorialModalOpen} onOpenChange={setTutorialModalOpen} />
    </>;
}
