
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Search, Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import { CommandModal } from './CommandModal';
import { Link } from 'react-router-dom';
import { ContentData } from '@/pages/ContentPage';

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contentData?.title) {
      setEditedTitle(contentData.title);
    }
  }, [contentData?.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        handleTitleSave();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, editedTitle]);

  const handleTitleEdit = () => {
    if (contentData && onUpdateContent) {
      setEditedTitle(contentData.title);
      setIsEditing(true);
    }
  };

  const handleTitleSave = () => {
    if (onUpdateContent && editedTitle.trim()) {
      onUpdateContent({ title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(contentData?.title || '');
    }
  };

  return (
    <header className="flex items-center p-4 sticky top-0 z-50 bg-dashboard-bg border-b border-dashboard-separator transition-colors duration-300">
      <div className="grid grid-cols-3 w-full items-center">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onOpenDrawer} className="dashboard-text hover:dashboard-text hover:bg-dashboard-card-hover">
            <Menu size={22} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Logo className="h-8 w-auto" textColor="text-dashboard-text" />
          
          {/* Content title - conditionally visible */}
          {contentData && (
            <div className="flex items-center ml-4">
              <span className="text-dashboard-text-secondary mx-2">—</span>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  className="bg-transparent border-none outline-none text-dashboard-text font-medium text-base focus:ring-0 min-w-0 max-w-md"
                />
              ) : (
                <button
                  onClick={handleTitleEdit}
                  className="text-dashboard-text font-medium text-base hover:text-dashboard-icons transition-colors duration-200 text-left truncate max-w-md"
                >
                  {contentData.title}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Center section - add navigation links */}
        <div className="flex justify-center space-x-2">
          <Button variant="ghost" className="dashboard-text hover:dashboard-text hover:bg-dashboard-card-hover" asChild>
            
          </Button>
          <Button variant="ghost" className="dashboard-text hover:dashboard-text hover:bg-dashboard-card-hover" asChild>
            
          </Button>
        </div>
        
        {/* Right section */}
        <div className="flex justify-end items-center gap-3 pr-2">
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
