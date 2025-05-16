
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, History, Clock, Box, MessageCircle, Book, Chrome } from 'lucide-react';

interface DrawerContentProps {
  onFeedbackClick: () => void;
  onTutorialClick: () => void;
  hasSeenTutorial: boolean;
}

export function DrawerContent({ 
  onFeedbackClick, 
  onTutorialClick, 
  hasSeenTutorial 
}: DrawerContentProps) {
  return (
    <div className="flex flex-col h-[calc(100%-130px)] overflow-auto">
      {/* Add Content Button */}
      <div className="px-4 pt-4 pb-2">
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary-light text-white">
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
      
      {/* Spaces Section */}
      <div className="px-4 py-2">
        <h3 className="text-white/70 text-xs font-medium mb-2 px-2">Rooms</h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
            <Link to="/spaces/1">
              <Box size={18} className="mr-2" />
              <span>Azzam's Room</span>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
            <Link to="/spaces/2">
              <Box size={18} className="mr-2" />
              <span>Untitled Room</span>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white border border-dashed border-white/20 rounded-md mt-2" asChild>
            <Link to="/spaces/new">
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
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" onClick={onFeedbackClick}>
            <MessageCircle size={18} className="mr-2" />
            <span>Feedback</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white relative" onClick={onTutorialClick}>
            <Book size={18} className="mr-2" />
            <span>Quick Guide</span>
            {!hasSeenTutorial && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-green-500"></span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
            <Link to="/extension">
              <Chrome size={18} className="mr-2" />
              <span>Extension</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
