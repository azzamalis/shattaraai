import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, MoreVertical, Pencil, Check, Share, Trash2, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { ContentItem } from '@/lib/types';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LearningCardProps {
  content: ContentItem;
  onDelete: () => void;
  onShare: () => void;
  onAddToRoom?: (roomId: string) => void;
}

// Mock rooms data - in a real app, this would come from context or props
const availableRooms = [{
  id: '1',
  name: "Azzam's Room"
}, {
  id: '2',
  name: 'Project Neom'
}, {
  id: '3',
  name: 'Physics Lab'
}, {
  id: '4',
  name: 'Math Studies'
}];

export function LearningCard({
  content,
  onDelete,
  onShare,
  onAddToRoom
}: LearningCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addToRoomOpen, setAddToRoomOpen] = useState(false);
  const navigate = useNavigate();

  const handleSaveTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Title updated successfully");
    setIsEditing(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(true);
  };

  const handleCardClick = () => {
    navigate(`/content/${content.id}?type=${content.type}`);
  };

  const handleAddToRoom = (roomId: string, roomName: string) => {
    if (onAddToRoom) {
      onAddToRoom(roomId);
    }
    toast.success(`Added to "${roomName}"`);
    setAddToRoomOpen(false);
    setMenuOpen(false);
  };

  return (
    <div onClick={handleCardClick} className="block w-full cursor-pointer">
      <div className={cn(
        // Card container
        "bg-card/20 dark:bg-neutral-900/80",
        "flex flex-col justify-between",
        "p-1.5 h-[280px]",
        "rounded-xl border border-border/5",
        "transition-all duration-200",
        "hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]",
        "group relative"
      )}>
        {/* Content preview section */}
        <div className={cn(
          "relative w-full aspect-video",
          "rounded-lg overflow-hidden",
          "border border-border/10"
        )}>
          {/* Menu button */}
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <button onClick={handleMenuClick} className={cn(
                "absolute z-30 top-2.5 right-2.5",
                "p-1 rounded-full",
                "bg-transparent group-hover:bg-white/10",
                "transition-all duration-200",
                "hover:scale-110"
              )}>
                <MoreVertical className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={5} className="w-[140px] bg-popover rounded-lg border-border p-1 px-[2px] py-[2px]">
              <div className="flex flex-col">
                <Popover open={addToRoomOpen} onOpenChange={setAddToRoomOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                      e.stopPropagation();
                      setAddToRoomOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[160px] bg-popover rounded-lg border-border p-1" side="left" align="start" sideOffset={8}>
                    <div className="flex flex-col">
                      {availableRooms.map(room => (
                        <Button key={room.id} variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                          e.stopPropagation();
                          handleAddToRoom(room.id, room.name);
                        }}>
                          {room.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onShare();
                }}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete();
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Thumbnail Preview */}
          <div className={cn(
            "w-full h-full",
            "relative",
            "flex items-center justify-center", // Added for placeholder alignment
            "bg-gradient-to-b from-transparent to-black/5 dark:to-black/20"
          )}>
            {content.metadata?.thumbnailUrl ? (
              <img
                src={content.metadata.thumbnailUrl}
                alt={content.title}
                className="object-cover w-full h-full absolute inset-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <span className="text-muted-foreground text-sm">No thumbnail</span>
              </div>
            )}
          </div>

          {/* Removed: Progress Overlay */}
        </div>

        {/* Content Info Section */}
        <div className="p-3 flex flex-col justify-between flex-grow">
          {/* Title */}
          <div className="relative group/title">
            {isEditing ? (
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={cn(
                    "w-full bg-transparent",
                    "text-foreground text-sm font-medium",
                    "focus:outline-none focus:ring-0",
                    "border-b border-border",
                    "pr-8"
                  )}
                  autoFocus
                  spellCheck="false"
                />
                <button onClick={handleSaveTitle} className="absolute right-0 text-muted-foreground hover:text-foreground transition-colors">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <h3 className="text-sm font-medium text-foreground pr-8 line-clamp-2 tracking-wide">
                  {title}
                </h3>
                <button onClick={e => {
                  e.stopPropagation();
                  setIsEditing(true);
                }} className="absolute right-0 opacity-0 group-hover/title:opacity-100 transition-opacity">
                  <Pencil className="w-4 h-4 text-primary/40 hover:text-primary transition-colors" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Info (Room Name Only) */}
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Azzam's Room</span> {/* Assuming "Azzam's Room" is a placeholder or always fixed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}