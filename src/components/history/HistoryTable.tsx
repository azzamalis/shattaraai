import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { Clock, History as HistoryIcon, MoreHorizontal, Plus, Share, Trash } from 'lucide-react';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { Room } from '@/lib/types';

export interface HistoryItem {
  id: string;
  title: string;
  room: string;
  date: Date;
  type: string;
  url?: string;
}

interface HistoryTableProps {
  items: HistoryItem[];
  onItemClick: (id: string) => void;
  rooms?: Room[];
  onAddToRoom?: (contentId: string, roomId: string) => void;
  onDelete?: (id: string) => void;
}

export function HistoryTable({ 
  items, 
  onItemClick, 
  rooms = [], 
  onAddToRoom,
  onDelete 
}: HistoryTableProps) {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<HistoryItem | null>(null);

  const handleShareClick = (item: HistoryItem) => {
    setSelectedItem(item);
    setShareModalOpen(true);
  };

  const handleDeleteClick = (item: HistoryItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem && onDelete) {
      onDelete(selectedItem.id);
      setSelectedItem(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="border-border hover:bg-accent">
            <TableHead className="text-foreground">Title</TableHead>
            <TableHead className="text-foreground">Room</TableHead>
            <TableHead className="text-foreground">Type</TableHead>
            <TableHead className="text-foreground">Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow 
              key={item.id} 
              className="border-border hover:bg-accent cursor-pointer"
              onClick={() => onItemClick(item.id)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {item.type === 'Document Analysis' && <HistoryIcon size={16} className="text-blue-400" />}
                  {item.type === 'Meeting Notes' && <Clock size={16} className="text-green-400" />}
                  {item.type === 'Chat' && <Clock size={16} className="text-purple-400" />}
                  {item.type === 'Research' && <HistoryIcon size={16} className="text-amber-400" />}
                  <span className="text-foreground">{item.title}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{item.room}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.type === 'Document Analysis' ? 'bg-blue-500/20 text-blue-400' :
                  item.type === 'Meeting Notes' ? 'bg-green-500/20 text-green-400' :
                  item.type === 'Chat' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.type}
                </span>
              </TableCell>
              <TableCell className="text-foreground">{format(item.date, 'MMM d, yyyy • h:mm a')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-7 w-7 p-0 shrink-0 hover:bg-primary/10 transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] bg-popover border-border z-50">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors focus:bg-accent focus:text-accent-foreground rounded-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-[160px] bg-popover border-border z-[60]" alignOffset={-5} sideOffset={8}>
                        {rooms && rooms.length > 0 ? rooms.map(room => (
                          <DropdownMenuItem 
                            key={room.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToRoom?.(item.id, room.id);
                            }} 
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors focus:bg-accent focus:text-accent-foreground rounded-sm px-2 py-1.5 text-sm"
                          >
                            {room.name}
                          </DropdownMenuItem>
                        )) : (
                          <DropdownMenuItem disabled className="px-2 py-1.5 text-sm text-muted-foreground">
                            No rooms available
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareClick(item);
                      }} 
                      className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors focus:bg-accent focus:text-accent-foreground rounded-sm"
                    >
                      <Share className="mr-2 h-4 w-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item);
                      }} 
                      className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No history items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Share Modal */}
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={setShareModalOpen} 
        type="content" 
        itemToShare={{
          id: selectedItem?.id || '',
          title: selectedItem?.title || '',
          url: selectedItem?.url
        }} 
      />
      
      {/* Delete Modal */}
      <DeleteModal 
        open={deleteModalOpen} 
        onOpenChange={setDeleteModalOpen} 
        type="content" 
        itemToDelete={{
          id: selectedItem?.id || '',
          title: selectedItem?.title || ''
        }} 
        onConfirm={handleDeleteConfirm} 
      />
    </>
  );
}
