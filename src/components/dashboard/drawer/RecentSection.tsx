
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Share, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ContentPreview } from '@/components/content/ContentPreview';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { Room } from '@/lib/types';
import { toast } from 'sonner';

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
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState<any>(null);
  const [openAddMenus, setOpenAddMenus] = React.useState<Set<string>>(new Set());

  // Sort content by date and take the first 5, with null check
  const sortedRecentContent = React.useMemo(() => {
    if (!recentContent || !Array.isArray(recentContent)) return [];
    return [...recentContent].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [recentContent]);

  const handleAddToRoom = React.useCallback((contentId: string, roomId: string) => {
    try {
      // Find the room and content
      const room = rooms.find(r => r.id === roomId);
      const content = recentContent?.find(c => c.id === contentId);
      if (!room || !content) {
        console.error('Room or content not found');
        return;
      }

      // Navigate to the room with the content
      navigate(`/rooms/${roomId}`);

      // Store the content in the room
      try {
        const existingContent = JSON.parse(localStorage.getItem(`room_${roomId}_content`) || '[]');
        const updatedContent = [...existingContent, content];
        localStorage.setItem(`room_${roomId}_content`, JSON.stringify(updatedContent));
        toast.success(`Added "${content.title}" to ${room.name}`);
      } catch (error) {
        console.error('Error storing content:', error);
        toast.error('Failed to add content to room');
      }
    } catch (error) {
      console.error('Error in handleAddToRoom:', error);
      toast.error('Something went wrong');
    }

    // Close the add menu after selection
    setOpenAddMenus(new Set());
  }, [rooms, recentContent, navigate]);

  const handleShareClick = (content: any) => {
    setSelectedContent(content);
    setShareModalOpen(true);
  };

  const handleDeleteClick = (content: any) => {
    setSelectedContent(content);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedContent) {
      onDeleteContent(selectedContent.id);
      toast.success(`"${selectedContent.title}" has been deleted`);
      setSelectedContent(null);
      setDeleteModalOpen(false);
    }
  };

  const toggleAddMenu = (contentId: string) => {
    const newOpenMenus = new Set(openAddMenus);
    if (newOpenMenus.has(contentId)) {
      newOpenMenus.delete(contentId);
    } else {
      // Close all other menus and open this one
      newOpenMenus.clear();
      newOpenMenus.add(contentId);
    }
    setOpenAddMenus(newOpenMenus);
  };

  return <>
      <div>
        <p className="ml-2 text-sm mb-2 font-semibold text-foreground">Recents</p>
        <div className="flex flex-col space-y-1">
          {!sortedRecentContent || sortedRecentContent.length === 0 ? <div className="px-3 py-4 rounded-lg bg-primary/5 border border-dashed border-primary/10">
              <p className="text-primary/60 text-sm text-center">
                No recent content
              </p>
            </div> : <>
              {sortedRecentContent.map(item => <div key={item.id} className="group flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                  <Button variant="ghost" className="flex-1 h-fit p-0 text-left hover:bg-transparent" asChild>
                    <Link to={`/content/${item.id}?type=${item.type}`} className="flex items-center gap-2 min-w-0 text-primary/80 hover:text-primary transition-colors">
                      <ContentPreview type={item.type} className="w-4 h-4 flex-shrink-0" />
                      <p className="truncate text-sm font-normal">{item.title}</p>
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 shrink-0 hover:bg-primary/10 transition-all duration-200">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" alignOffset={-5} className="w-[160px] bg-popover border-border z-[100]">
                      <div className="relative">
                        <DropdownMenuItem 
                          onClick={() => toggleAddMenu(item.id)}
                          className="flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors focus:bg-accent focus:text-accent-foreground rounded-sm"
                        >
                          <div className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Add</span>
                          </div>
                          <span className="text-xs text-muted-foreground">▶</span>
                        </DropdownMenuItem>
                        
                        {openAddMenus.has(item.id) && (
                          <div className="absolute left-full top-0 ml-1 w-[160px] bg-popover border border-border rounded-md shadow-lg z-[110] py-1">
                            {rooms && rooms.length > 0 ? rooms.map(room => (
                              <button
                                key={room.id}
                                onClick={() => handleAddToRoom(item.id, room.id)}
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors focus:bg-accent focus:text-accent-foreground rounded-sm"
                              >
                                {room.name}
                              </button>
                            )) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                No rooms available
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <DropdownMenuItem onClick={() => handleShareClick(item)} className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors focus:bg-accent focus:text-accent-foreground rounded-sm">
                        <Share className="mr-2 h-4 w-4" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>)}
            </>}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} type="content" itemToShare={{
      id: selectedContent?.id || '',
      title: selectedContent?.title || '',
      url: selectedContent?.url
    }} />
      
      {/* Delete Modal */}
      <DeleteModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} type="content" itemToDelete={{
      id: selectedContent?.id || '',
      title: selectedContent?.title || ''
    }} onConfirm={handleDeleteConfirm} />
    </>;
};
