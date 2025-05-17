import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Plus, Search, Upload, Send, Mic, Box, ChevronDown, FileIcon, LinkIcon, MicIcon, Trash2, X, MessageSquare, MoreVertical, Pencil, Check, Share, Copy, Globe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { RoomCard } from './RoomCard';
import { Room, RoomHandlers } from '@/lib/types';

interface DashboardProps extends RoomHandlers {
  rooms: Room[];
}

export function Dashboard({ rooms, onAddRoom, onEditRoom, onDeleteRoom }: DashboardProps) {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: 'room' | 'card';
    name: string;
    parentName?: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Python Language");

  const handlePasteSubmit = (data: {
    url?: string;
    text?: string;
  }) => {
    // Handle the submitted data here
    if (data.url) {
      toast.success("URL content added successfully");
    } else if (data.text) {
      toast.success("Text content added successfully");
    }
  };
  const handleAISubmit = (value: string) => {
    toast.success("Your question was submitted");
    console.log("AI query:", value);
    // Here you would typically send the query to your AI backend
  };
  const handleDeleteClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setItemToDelete({
        id: room.id,
        type: 'room',
        name: room.name
      });
      setDeleteModalOpen(true);
    }
  };
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'room') {
      onDeleteRoom(itemToDelete.id);
      toast.success(`"${itemToDelete.name}" has been deleted`);
    } else if (itemToDelete.type === 'card') {
      // Handle card deletion here when implemented
      toast.success(`"${itemToDelete.name}" has been deleted from ${itemToDelete.parentName}`);
    }

    setItemToDelete(null);
    setDeleteModalOpen(false);
  };
  const handleMenuClick = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    setMenuOpen(true);
  };
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setShareModalOpen(true);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    // Set up card deletion
    setItemToDelete({
      id: 'python-card',
      type: 'card',
      name: title,
      parentName: "Azzam's Space"
    });
    setDeleteModalOpen(true);
  };
  const handleSaveTitle = () => {
    // Add your save logic here
    toast.success("Title updated successfully");
  };
  const handleEditRoom = (roomId: string, newName: string) => {
    onEditRoom(roomId, newName);
    toast.success("Room name updated successfully");
  };
  const handleAddRoom = () => {
    onAddRoom();
    toast.success("New room created successfully");
  };
  return <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-[#222222]">
        <div className="max-w-6xl mx-auto">
          {/* Practice with exams section - with popover matching profile style */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-transparent hover:bg-white/5 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#00A3FF]/20 text-[#00A3FF] font-medium text-xs px-2 py-0.5 pointer-events-none">
                      NEW
                    </Badge>
                    <span>Practice with exams</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] bg-[#1A1A1A] border border-white/10 text-white p-0" align="center" sideOffset={5}>
                <div className="py-2 px-1">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-400">Choose a Room</div>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-primary/10 hover:!text-white group">
                    <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
                    <span>Azzam's Room</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-primary/10 hover:!text-white group">
                    <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
                    <span>Project 'Neom'</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-primary/10 hover:!text-white group">
                    <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
                    <span>Untitled Room</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Centered main heading with responsive font size */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-12 text-center">What do you want to learn today?</h1>
          
          {/* Responsive grid for cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
            {/* Upload Document Card */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer group">
                    <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full group-hover:border-white/20">
                      <Upload className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-1 md:mb-2 text-base md:text-lg">Upload</CardTitle>
                    <CardDescription className="text-gray-400 text-xs md:text-sm">File, Audio, Video</CardDescription>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
                  <p className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-gray-400" />
                    Supported file types: PDF, PPT, DOC, TXT, Audio, Video
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Paste Text Card */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer group" onClick={() => setIsPasteModalOpen(true)}>
                    <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full group-hover:border-white/20">
                      <FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-1 md:mb-2 text-base md:text-lg">Paste</CardTitle>
                    <CardDescription className="text-gray-400 text-xs md:text-sm">YouTube, Website, Text</CardDescription>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
                  <p className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                    YouTube Link, Website URL, Text content
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Record Audio Card */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer group">
                    <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full group-hover:border-white/20">
                      <Mic className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-1 md:mb-2 text-base md:text-lg">Record</CardTitle>
                    <CardDescription className="text-gray-400 text-xs md:text-sm">Record Your Lecture</CardDescription>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
                  <p className="flex items-center gap-2">
                    <MicIcon className="h-4 w-4 text-gray-400" />
                    Record your lectures in real-time
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* AI Assistant Input with enhanced animation */}
          <div className="mb-6 sm:mb-8">
            <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
          </div>

          {/* My Rooms section */}
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-xl text-white mb-4">My rooms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rooms.map(room => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  formattedDate={`Last active: ${room.lastActive}`}
                  onEdit={handleEditRoom}
                  onDelete={handleDeleteClick}
                />
              ))}

              {/* Add Room Button */}
              <RoomCard
                isAddButton
                onAdd={handleAddRoom}
              />
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogContent className="bg-[#1A1A1A] text-white border-white/10 p-6 rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-500/10">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold">
                  Delete {itemToDelete?.type === 'card' ? 'Card' : 'Room'}
                </h2>
              </div>

              {/* Message */}
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "<span className="text-white">{itemToDelete?.name}</span>"?
                {itemToDelete?.type === 'card' && itemToDelete?.parentName && (
                  <span className="block mt-1 text-sm">
                    This card will be removed from <span className="text-white">{itemToDelete.parentName}</span>
                  </span>
                )}
                <br />
                <span className="text-sm opacity-75">This action cannot be undone.</span>
              </p>

              {/* Buttons */}
              <div className="flex justify-end items-center gap-3">
                <DialogClose asChild>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white hover:bg-white/5
                      px-4 py-2 transition-colors duration-200"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  className="bg-red-500 hover:bg-red-600 text-white px-4"
                  onClick={handleDeleteConfirm}
                >
                  Delete {itemToDelete?.type === 'card' ? 'Card' : 'Room'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Continue learning section */}
          <div className="mt-8">
            {/* Header with View all link */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Continue learning</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">View all</button>
            </div>
            
            {/* Card container */}
            <div className="flex flex-col gap-4">
              {/* Learning card - Main dark container */}
              <div className="w-[320px] bg-[#1A1A1A] rounded-2xl overflow-hidden group transition-shadow hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {/* Content wrapper */}
                <div className="p-3">
                  {/* White area container */}
                  <div className="bg-white rounded-xl w-full mb-3 relative">
                    {/* Three dots menu - only visible on hover */}
                    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                      <PopoverTrigger asChild>
                        <button onClick={e => handleMenuClick(e, 'python-card')} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[140px] bg-black/90 rounded-lg border-none p-1" align="end" sideOffset={5}>
                        <div className="flex flex-col">
                          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white rounded-md px-3 py-2 text-sm font-normal" onClick={handleShare}>
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white rounded-md px-3 py-2 text-sm font-normal" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div className="pt-8 pb-3 px-4">
                      {/* Centered chat icon */}
                      <div className="flex justify-center mb-8">
                        <MessageSquare className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      {/* Left-aligned space name - updated to black text */}
                      <div className="flex items-center gap-2 text-sm text-black">
                        <Globe className="w-4 h-4" />
                        <span className="text-base">Azzam's Space</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Title area with edit functionality */}
                  <div className="px-2 flex justify-between items-center">
                    {isEditing ? <div className="flex-1 flex items-center gap-2">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="flex-1 bg-transparent text-white text-lg font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 border-b border-white/20 px-0 selection:bg-white/10" autoFocus spellCheck="false" />
                        <button onClick={() => {
                      handleSaveTitle();
                      setIsEditing(false);
                    }} className="text-gray-400 hover:text-white">
                          <Check className="w-4 h-4" />
                        </button>
                      </div> : <div className="flex-1 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">{title}</h3>
                        <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                      </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Paste Content Modal */}
      <PasteContentModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onSubmit={handlePasteSubmit} />

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="p-0 border-0">
          <div className="bg-[#1A1A1A] rounded-xl w-full">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Share className="w-5 h-5 text-white" />
                <span className="text-white text-base">Share public link to content</span>
              </div>
              <DialogClose asChild>
                <button className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 min-w-0 bg-black/50 rounded-lg px-3 py-2 text-gray-400 text-sm">
                  <span className="truncate block">https://shattara.ai/dashboard/room/1588830905134054</span>
                </div>
                <Button className="bg-white hover:bg-white/90 rounded-lg px-4 py-2 flex items-center gap-2 whitespace-nowrap" onClick={() => {
                navigator.clipboard.writeText("https://shattara.ai/dashboard/room/1588830905134054");
                toast.success("Link copied to clipboard");
              }}>
                  <Copy className="w-4 h-4 text-black" />
                  <span className="text-sm font-medium text-black">Copy link</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}