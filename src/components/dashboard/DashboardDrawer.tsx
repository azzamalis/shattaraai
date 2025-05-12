import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import { Plus, History, Clock, Box, MessageCircle, Book, Chrome, User, ChevronsLeft } from 'lucide-react';
interface DashboardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function DashboardDrawer({
  open,
  onOpenChange
}: DashboardDrawerProps) {
  return <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] bg-[#222222] border-r border-white/20 p-0" closeButton={false}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-auto" textColor="text-white" />
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/10 hover:text-primary">
            <ChevronsLeft size={22} />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full overflow-auto">
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
            <h3 className="text-white/70 text-xs font-medium mb-2 px-2">Spaces</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                <Link to="/spaces/1">
                  <Box size={18} className="mr-2" />
                  <span>Azzam's Space</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                <Link to="/spaces/2">
                  <Box size={18} className="mr-2" />
                  <span>Untitled Space</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white border border-dashed border-white/20 rounded-md mt-2" asChild>
                <Link to="/spaces/new">
                  <Plus size={18} className="mr-2" />
                  <span>Add Space</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Help & Tools Section */}
          <div className="px-4 py-2">
            <h3 className="text-white/70 text-xs font-medium mb-2 px-2">Help & Tools</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                <Link to="/feedback">
                  <MessageCircle size={18} className="mr-2" />
                  <span>Feedback</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                <Link to="/help">
                  <Book size={18} className="mr-2" />
                  <span>Quick Guide</span>
                </Link>
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

        {/* Footer */}
        <div className="border-t border-white/20 p-4 mt-auto bg-[#222222]">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <User size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-white">Free Plan</p>
              <p className="truncate text-xs text-gray-400">user@shattara.ai</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
}