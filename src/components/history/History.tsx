import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Clock, Filter, History as HistoryIcon, MoreVertical, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

// Sample history data
const historyItems = [
  {
    id: '1',
    title: 'Research on Climate Change',
    room: 'Azzam\'s Room',
    date: new Date('2025-05-15T14:30:00'),
    type: 'Document Analysis'
  },
  {
    id: '2',
    title: 'Project Neom Meeting Notes',
    room: 'Project \'Neom\'',
    date: new Date('2025-05-14T10:15:00'),
    type: 'Meeting Notes'
  },
  {
    id: '3',
    title: 'AI Ethics Discussion',
    room: 'Azzam\'s Room',
    date: new Date('2025-05-14T09:30:00'),
    type: 'Chat'
  },
  {
    id: '4',
    title: 'Sustainability Solutions',
    room: 'Untitled Room',
    date: new Date('2025-05-13T16:45:00'),
    type: 'Research'
  },
  {
    id: '5',
    title: 'Education Strategy',
    room: 'Azzam\'s Room',
    date: new Date('2025-05-12T13:20:00'),
    type: 'Document Analysis'
  }
];

export function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter history items based on search query and type filter
  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">History</h1>
          <Button 
            variant="outline" 
            className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </Button>
        </div>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search history..." 
              className="pl-10 bg-[#1A1A1A] border-white/20 text-white placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-[#1A1A1A] border-white/20 text-white">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/20 text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Document Analysis">Document Analysis</SelectItem>
                <SelectItem value="Meeting Notes">Meeting Notes</SelectItem>
                <SelectItem value="Chat">Chat</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="bg-[#1A1A1A] border-white/20 text-white">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage your recent interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#222]">
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white/70">Title</TableHead>
                  <TableHead className="text-white/70">Room</TableHead>
                  <TableHead className="text-white/70">Type</TableHead>
                  <TableHead className="text-white/70">Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="border-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => console.log(`Navigating to item: ${item.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.type === 'Document Analysis' && <HistoryIcon size={16} className="text-blue-400" />}
                        {item.type === 'Meeting Notes' && <Clock size={16} className="text-green-400" />}
                        {item.type === 'Chat' && <Clock size={16} className="text-purple-400" />}
                        {item.type === 'Research' && <HistoryIcon size={16} className="text-amber-400" />}
                        {item.title}
                      </div>
                    </TableCell>
                    <TableCell>{item.room}</TableCell>
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
                    <TableCell>{format(item.date, 'MMM d, yyyy • h:mm a')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
                            <MoreVertical size={16} />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/20 text-white">
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                            Copy to Room
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-white/10 hover:text-red-400">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-white/50">
                      No history items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
