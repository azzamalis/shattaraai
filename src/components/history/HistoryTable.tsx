
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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Clock, History as HistoryIcon, MoreVertical } from 'lucide-react';

export interface HistoryItem {
  id: string;
  title: string;
  room: string;
  date: Date;
  type: string;
}

interface HistoryTableProps {
  items: HistoryItem[];
  onItemClick: (id: string) => void;
}

export function HistoryTable({ items, onItemClick }: HistoryTableProps) {
  return (
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:text-foreground hover:bg-accent">
                    <MoreVertical size={16} />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent">
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent">
                    Add
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-accent hover:text-red-400">
                    Delete
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
  );
}
