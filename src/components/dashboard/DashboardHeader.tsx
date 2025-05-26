import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Search, Menu, History, BarChart, Pencil } from 'lucide-react';
import Logo from '@/components/Logo';
import { CommandModal } from './CommandModal';
import { Link, useLocation } from 'react-router-dom';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  onOpenDrawer: () => void;
  contentData?: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
}

export function DashboardHeader({
  onOpenDrawer,
  contentData,
  onUpdateContent
}: DashboardHeaderProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(contentData?.title || '');
  const location = useLocation();
  
  const isContentPage = location.pathname.startsWith('/content/');

  const handleTitleEdit = () => {
    setEditedTitle(contentData?.title || '');
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    if (onUpdateContent && contentData && editedTitle.trim() !== '') {
      onUpdateContent({ title: editedTitle.trim() });
    } else {
      setEditedTitle(contentData?.title || ''); // Reset to original if empty
    }
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(contentData?.title || '');
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleTitleCancel();
    }
  };

  return (
    <header className="flex items-center p-4 sticky top-0 z-50 bg-dashboard-bg dark:bg-dashboard-bg transition-colors duration-300">
      <div className="flex w-full items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3 min-w-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenDrawer} 
            className="text-dashboard-text hover:text-dashboard-text hover:bg-dashboard-card-hover shrink-0"
          >
            <Menu size={22} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <Logo 
            className="h-8 w-auto shrink-0"
            textColor="text-dashboard-text"
          />
          
          {/* Content Title */}
          {isContentPage && contentData && (
            <div className="flex items-center gap-2 ml-4 group min-w-0 flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleCancel}
                  className={cn(
                    "bg-transparent text-sm px-1",
                    "text-dashboard-text placeholder-dashboard-text-secondary",
                    "outline-none border-none focus:ring-0",
                    "focus:outline-none focus:border-none",
                    "w-full max-w-[500px]",
                    "truncate"
                  )}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span 
                    className={cn(
                      "text-dashboard-text-secondary text-sm cursor-pointer",
                      "hover:text-dashboard-text truncate",
                      "max-w-[500px]"
                    )}
                    onClick={handleTitleEdit}
                    title={contentData.title}
                  >
                    {contentData.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity",
                      "h-6 w-6 rounded-full shrink-0",
                      "text-dashboard-text-secondary hover:text-dashboard-text",
                      "hover:bg-dashboard-card-hover"
                    )}
                    onClick={handleTitleEdit}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right section */}
        <div className="flex items-center justify-end gap-4">
          {/* Upgrade button */}
          <Link to="/pricing">
            <Button variant="outline" className="bg-transparent border-2 border-[#00A3FF] text-[#00A3FF] hover:text-[#00A3FF] hover:bg-[#00A3FF]/5 transition-all rounded-full px-8 py-5 h-9 shadow-[0_2px_8px_rgba(0,163,255,0.25)] hover:shadow-[0_2px_12px_rgba(0,163,255,0.35)]">
              Upgrade
            </Button>
          </Link>

          {/* Command button */}
          <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="
                bg-[#F3F3F3] border-none 
                text-[#8D8D8D] 
                hover:bg-[#F7F7F7] hover:text-[#8D8D8D]
                dark:bg-[#292929] dark:text-dashboard-text-secondary 
                dark:hover:bg-white/5 dark:hover:text-dashboard-text
                rounded-full px-6 py-5 h-9 flex items-center justify-center gap-1.5 min-w-[120px] transition-all duration-200
              ">
                <Search className="h-4 w-4" />
                <span className="text-sm font-medium mx-0.5">⌘</span>
                <span className="text-sm font-medium">K</span>
              </Button>
            </DialogTrigger>
            <CommandModal open={commandOpen} onOpenChange={setCommandOpen} />
          </Dialog>
        </div>
      </div>
    </header>
  );
}
