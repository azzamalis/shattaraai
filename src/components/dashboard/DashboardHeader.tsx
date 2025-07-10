import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Search, Menu, Pencil } from 'lucide-react';
import Logo from '@/components/Logo';
import { CommandModal } from './CommandModal';
import { Link, useLocation } from 'react-router-dom';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';
import { Room } from '@/lib/types';
import { useContentContext } from '@/contexts/ContentContext';
import { toast } from 'sonner';
interface DashboardHeaderProps {
  onOpenDrawer: () => void;
  contentData?: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
  rooms: Room[];
  onAddRoom: () => Promise<string | null>;
}
export function DashboardHeader({
  onOpenDrawer,
  contentData,
  onUpdateContent,
  rooms,
  onAddRoom
}: DashboardHeaderProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(contentData?.title || '');
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const {
    onUpdateContent: updateContentInDB
  } = useContentContext();
  const isContentPage = location.pathname.startsWith('/content/');

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(open => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const handleTitleEdit = () => {
    setEditedTitle(contentData?.title || '');
    setIsEditing(true);
  };
  const handleTitleSave = async () => {
    if (contentData && editedTitle.trim() !== '' && editedTitle.trim() !== contentData.title) {
      try {
        // Update in database
        await updateContentInDB(contentData.id, {
          title: editedTitle.trim()
        });

        // Update local state if callback provided
        if (onUpdateContent) {
          onUpdateContent({
            title: editedTitle.trim()
          });
        }
        toast.success('Title updated successfully');
      } catch (error) {
        console.error('Error updating title:', error);
        toast.error('Failed to update title');
        setEditedTitle(contentData.title); // Reset to original if failed
      }
    } else if (editedTitle.trim() === '') {
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
  return <header className="flex items-center p-4 sticky top-0 z-50 bg-background transition-colors duration-300 py-[10px]">
      <div className="flex w-full items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={onOpenDrawer} className="text-foreground hover:text-foreground hover:bg-accent shrink-0">
            <Menu size={22} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <Logo className="h-8 w-auto shrink-0" textColor="text-foreground" />
          
          {/* Content Title */}
          {isContentPage && contentData && <div className="flex items-center gap-2 ml-4 group min-w-0 flex-1">
              {isEditing ? <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} onKeyDown={handleTitleKeyDown} onBlur={handleTitleSave} className={cn("bg-transparent text-sm px-1", "text-foreground placeholder-muted-foreground", "outline-none border-none focus:ring-0", "focus:outline-none focus:border-none", "w-full max-w-[500px]", "truncate")} autoFocus /> : <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={cn("text-muted-foreground text-sm cursor-pointer", "hover:text-foreground truncate", "max-w-[500px]")} onClick={handleTitleEdit} title={contentData.title}>
                    {contentData.title}
                  </span>
                  <Button variant="ghost" size="icon" className={cn("opacity-0 group-hover:opacity-100 transition-opacity", "h-6 w-6 rounded-full shrink-0", "text-muted-foreground hover:text-foreground", "hover:bg-accent")} onClick={handleTitleEdit}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>}
            </div>}
        </div>
        
        {/* Right section */}
        <div className="flex items-center justify-end gap-4">
          {/* Upgrade button - Hidden on mobile with new #00A3FF color styling */}
          {!isMobile && <Link to="/pricing">
              <Button variant="outline" className="bg-[#00A3FF]/5 border-2 border-[#00A3FF]/80 text-[#00A3FF] hover:text-[#00A3FF] hover:bg-[#00A3FF]/10 hover:border-[#00A3FF] transition-all py-5 h-9 shadow-[0_2px_8px_rgba(0,163,255,0.15)] hover:shadow-[0_4px_16px_rgba(0,163,255,0.25)] rounded-2xl px-[21px] hover:shadow-[#00A3FF]/20">
                Upgrade
              </Button>
            </Link>}

          {/* Command button */}
          <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
            <DialogTrigger asChild>
              {isMobile ?
            // Mobile: Search icon only
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border border-input bg-background/50 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Search</span>
                </Button> :
            // Desktop: Only ⌘K with same styling as Upgrade button
            <Button variant="outline" className="bg-transparent border-border hover:text-primary hover:bg-primary/5 transition-all h-9 rounded-2xl px-[30px] text-base py-[21px]">
                  ⌘K
                </Button>}
            </DialogTrigger>
            <CommandModal open={commandOpen} onOpenChange={setCommandOpen} rooms={rooms} onAddRoom={onAddRoom} />
          </Dialog>
        </div>
      </div>
    </header>;
}