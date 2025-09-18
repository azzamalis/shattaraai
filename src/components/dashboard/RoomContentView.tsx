import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import {
  MoreVertical,
  Pencil,
  Check,
  Share,
  Trash2,
  Plus
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ContentItem } from '@/hooks/useContent';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface RoomContentViewProps {
  items: ContentItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export function RoomContentView({ items, onEdit, onDelete, onShare }: RoomContentViewProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [menuOpen, setMenuOpen] = useState<Set<string>>(new Set());
  const [addToRoomOpen, setAddToRoomOpen] = useState<Set<string>>(new Set());

  const handleEditStart = (item: ContentItem) => {
    setEditingId(item.id);
    setEditedTitle(item.title);
  };

  const handleEditSave = (id: string) => {
    onEdit(id);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={cn(
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
              <Popover 
                open={menuOpen.has(item.id)} 
                onOpenChange={(open) => {
                  if (!open) {
                    setMenuOpen(new Set());
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <button 
                    className={cn(
                      "absolute z-30 top-2.5 right-2.5",
                      "p-1 rounded-full",
                      "bg-transparent group-hover:bg-white/10",
                      "transition-all duration-200",
                      "hover:scale-110"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpen(new Set([item.id]));
                    }}
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[200px] p-1 z-[100]" 
                  align="start"
                  alignOffset={0}
                  side="right"
                  sideOffset={5}
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="flex flex-col">
                    <Popover 
                      open={addToRoomOpen.has(item.id)} 
                      onOpenChange={(open) => {
                        if (!open) {
                          setAddToRoomOpen(new Set());
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newState = new Set(addToRoomOpen);
                            if (newState.has(item.id)) {
                              newState.delete(item.id);
                            } else {
                              newState.add(item.id);
                            }
                            setAddToRoomOpen(newState);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-[200px] p-1 z-[101]" 
                        side="right" 
                        align="start" 
                        alignOffset={0}
                        sideOffset={8}
                        style={{ pointerEvents: 'auto' }}
                        onInteractOutside={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onPointerDownOutside={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onEscapeKeyDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <div 
                          className="flex flex-col"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            No rooms available
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(new Set());
                        onShare(item.id);
                      }}
                    >
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>

                    <Separator className="my-1" />

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(new Set());
                        onDelete(item.id);
                      }}
                    >
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
                "flex items-center justify-center",
                "bg-gradient-to-b from-transparent to-black/5 dark:to-black/20"
              )}>
                {item.metadata?.thumbnailUrl ? (
                  <img
                    src={item.metadata.thumbnailUrl}
                    alt={item.title}
                    className="object-cover w-full h-full absolute inset-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/20">
                    <span className="text-muted-foreground text-sm">No thumbnail</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Info Section */}
            <div className="p-4">
              {/* Title */}
              <div className="relative group/title">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editedTitle} 
                      onChange={e => setEditedTitle(e.target.value)} 
                      className={cn(
                        "w-full bg-transparent",
                        "text-foreground text-sm font-medium",
                        "focus:outline-none focus:ring-0",
                        "border-b border-border",
                        "pr-8"
                      )} 
                      autoFocus 
                      spellCheck="false"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(item.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <button 
                      onClick={() => handleEditSave(item.id)} 
                      className="absolute right-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <h3 className="text-sm font-medium text-foreground pr-8 line-clamp-2 tracking-wide">
                      {item.title}
                    </h3>
                    <button 
                      onClick={() => handleEditStart(item)} 
                      className="absolute right-0 opacity-0 group-hover/title:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-4 h-4 text-primary/40 hover:text-primary transition-colors" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}