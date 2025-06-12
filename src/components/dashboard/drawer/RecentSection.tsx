import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Share, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ContentPreview } from '@/components/content/ContentPreview';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { Room, ContentItem } from '@/lib/types';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface RecentSectionProps {
  rooms: Room[];
}

export const RecentSection: React.FC<RecentSectionProps> = ({
  rooms
}) => {
  const navigate = useNavigate();
  const {
    recentContent,
    onDeleteContent
  } = useContent();
  const [menuOpen, setMenuOpen] = useState<Set<string>>(new Set());
  const [addToRoomOpen, setAddToRoomOpen] = useState<Set<string>>(new Set());
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // Sort content by date and take the first 5, with null check
  const sortedRecentContent = React.useMemo(() => {
    if (!recentContent || !Array.isArray(recentContent)) return [];
    return [...recentContent].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [recentContent]);

  const handleShareClick = (item: ContentItem) => {
    setSelectedContent(item);
    setShareModalOpen(true);
  };

  const handleDeleteClick = (item: ContentItem) => {
    setSelectedContent(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedContent) {
      onDeleteContent(selectedContent.id);
      setSelectedContent(null);
      setDeleteModalOpen(false);
    }
  };

  const handleAddToRoom = (contentId: string, roomId: string, roomName: string) => {
    // Add to room logic here
    toast.success(`Added to "${roomName}"`);
    setAddToRoomOpen(new Set());
    setMenuOpen(new Set());
  };

  return (
    <>
      <div>
        <p className="ml-2 text-sm mb-2 font-semibold text-foreground">Recents</p>
        <div className="flex flex-col space-y-1">
          {!sortedRecentContent || sortedRecentContent.length === 0 ? (
            <div className="px-3 py-4 rounded-lg bg-primary/5 border border-dashed border-primary/10">
              <p className="text-primary/60 text-sm text-center">
                No recent content
              </p>
            </div>
          ) : (
            sortedRecentContent.map(item => (
              <div key={item.id} className="group flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                <Button variant="ghost" className="flex-1 h-fit p-0 text-left hover:bg-transparent" asChild>
                  <Link to={`/content/${item.id}?type=${item.type}`} className="flex items-center gap-2 min-w-0 text-primary/80 hover:text-primary transition-colors">
                    <ContentPreview type={item.type} className="w-4 h-4 flex-shrink-0" />
                    <p className="truncate text-sm font-normal">{item.title}</p>
                  </Link>
                </Button>
                
                <Popover open={menuOpen.has(item.id)} onOpenChange={(open) => {
                  if (!open) {
                    setMenuOpen(new Set());
                  }
                }}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 shrink-0 hover:bg-primary/10 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(new Set([item.id]));
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
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
                            {rooms && rooms.length > 0 ? (
                              rooms.map(room => (
                                <Button
                                  key={room.id}
                                  variant="ghost"
                                  className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToRoom(item.id, room.id, room.name);
                                  }}
                                >
                                  {room.name}
                                </Button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                No rooms available
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(new Set());
                          handleShareClick(item);
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
                          e.stopPropagation();
                          setMenuOpen(new Set());
                          handleDeleteClick(item);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={setShareModalOpen} 
        type="content" 
        itemToShare={{
          id: selectedContent?.id || '',
          title: selectedContent?.title || '',
          url: selectedContent?.url
        }} 
      />
      
      {/* Delete Modal */}
      <DeleteModal 
        open={deleteModalOpen} 
        onOpenChange={setDeleteModalOpen} 
        type="content" 
        itemToDelete={{
          id: selectedContent?.id || '',
          title: selectedContent?.title || ''
        }} 
        onConfirm={handleDeleteConfirm} 
      />
    </>
  );
};
