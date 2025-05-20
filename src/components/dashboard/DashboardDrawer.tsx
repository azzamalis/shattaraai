import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, History, Clock, Box, MessageCircle, Book, Chrome, Settings, Tag, Moon, LogOut, ChevronUp, ChevronsLeft, Pencil, Trash2, Check, X, ChevronDown, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { FeedbackModal } from './FeedbackModal';
import { TutorialModal } from './TutorialModal';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Room, RoomHandlers } from '@/lib/types';
interface DashboardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
  onAddRoom: () => void;
  onEditRoom: (id: string, newName: string) => void;
  onDeleteRoom: (id: string) => void;
}
export function DashboardDrawer({
  open,
  onOpenChange,
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: DashboardDrawerProps) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem('hasSeenTutorial') === 'true';
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [roomToDeleteName, setRoomToDeleteName] = useState<string>("");
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editedRoomName, setEditedRoomName] = useState("");
  const [showMoreRooms, setShowMoreRooms] = useState(false);

  // Split rooms into visible and hidden
  const visibleRooms = rooms.slice(0, 3);
  const hiddenRooms = rooms.slice(3);
  const hasHiddenRooms = rooms.length > 3;
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (!tutorialModalOpen) {
      setHasSeenTutorial(localStorage.getItem('hasSeenTutorial') === 'true');
    }
  }, [tutorialModalOpen]);
  const handleFeedbackClick = () => {
    console.log("Feedback button clicked");
    setFeedbackModalOpen(true);
  };
  const handleTutorialClick = () => {
    console.log("Tutorial button clicked");
    setTutorialModalOpen(true);
    setHasSeenTutorial(true);
    localStorage.setItem('hasSeenTutorial', 'true');
  };
  const handleLogout = () => {
    localStorage.removeItem('hasSeenTutorial');
    onOpenChange(false);
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account."
    });
    navigate('/');
  };
  const getDrawerWidth = () => {
    if (windowWidth < 640) return 'w-[85vw]';
    if (windowWidth < 768) return 'w-[350px]';
    return 'w-[300px]';
  };
  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
    onOpenChange(false);
  };
  const handleRenameClick = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setEditingRoomId(roomId);
      setEditedRoomName(room.name);
    }
  };
  const handleSaveRename = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (editedRoomName.trim()) {
      onEditRoom(roomId, editedRoomName.trim());
      setEditingRoomId(null);
    }
  };
  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRoomId(null);
  };
  const handleDeleteClick = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setRoomToDelete(roomId);
      setRoomToDeleteName(room.name);
      setDeleteModalOpen(true);
    }
  };
  const handleDeleteConfirm = () => {
    if (roomToDelete) {
      onDeleteRoom(roomToDelete);
      setRoomToDelete(null);
      setDeleteModalOpen(false);
    }
  };
  return <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className={`${getDrawerWidth()} bg-[#222222] border-r border-white/20 p-0`} closeButton={false}>
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Logo className="h-8 md:h-10 w-auto" textColor="text-white" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:text-white hover:bg-white/10">
              <ChevronsLeft size={22} />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <div className="flex flex-col h-[calc(100%-130px)] overflow-auto">
            <div className="px-4 pt-4 pb-2">
              <Button className="w-full flex items-center justify-center gap-2 
                  bg-transparent border border-dashed border-white/20 
                  text-white hover:bg-white/5 transition-colors duration-200" onClick={() => {
              navigate('/dashboard');
              onOpenChange(false);
            }}>
                <Plus size={18} />
                <span>New Content</span>
              </Button>
            </div>
            
            <div className="px-4 py-2">
              <h3 className="text-white/70 text-xs font-medium mb-2 px-2">History</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                  <Link to="/history">
                    <History size={18} className="mr-2" />
                    <span>History</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white" asChild>
                  <Link to="/recent">
                    <Clock size={18} className="mr-2" />
                    <span>Recents</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-white/70 text-xs font-medium">Rooms</h3>
                <span className="text-white/40 text-xs">{rooms.length} rooms</span>
              </div>

              <div className="space-y-1">
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2 
                    text-white hover:bg-white/5 
                    border border-dashed border-white/20 
                    rounded-md mb-2 transition-colors duration-200
                    hover:text-white" onClick={onAddRoom}>
                  <Plus size={18} />
                  <span>Add a Room</span>
                </Button>

                {visibleRooms.map(room => <Button key={room.id} variant="ghost" className="w-full flex items-center justify-between gap-2 px-2 py-1.5 
                      text-white hover:bg-white/5 transition-colors duration-200
                      hover:text-white group" onClick={() => handleRoomClick(room.id)}>
                    {editingRoomId === room.id ? <div className="flex-1 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <input type="text" value={editedRoomName} onChange={e => setEditedRoomName(e.target.value)} className="flex-1 bg-transparent border-none border-b border-white text-white outline-none focus:outline-none focus:ring-0 focus:border-none" style={{
                    borderBottom: '1px solid white'
                  }} autoFocus onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveRename(e as any, room.id);
                    if (e.key === 'Escape') handleCancelRename(e as any);
                  }} />
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => handleSaveRename(e, room.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancelRename}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div> : <>
                        <span className="flex-1 text-left truncate">{room.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={e => handleRenameClick(e, room.id)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={e => handleDeleteClick(e, room.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>}
                  </Button>)}

                {hasHiddenRooms && <Popover open={showMoreRooms} onOpenChange={setShowMoreRooms}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="w-full flex items-center justify-between px-2 py-1.5 
                          text-white/60 hover:bg-white/5 hover:text-white 
                          transition-colors duration-200 group">
                        <span className="flex items-center gap-2">
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          <span>Show More</span>
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(300px-2rem)] bg-[#1A1A1A] border-white/10 p-1" align="center" sideOffset={5}>
                      <div className="space-y-1">
                        {hiddenRooms.map(room => <Button key={room.id} variant="ghost" className="w-full flex items-center justify-between gap-2 px-2 py-1.5 
                              text-white hover:bg-white/5 transition-colors duration-200
                              hover:text-white group" onClick={() => handleRoomClick(room.id)}>
                            {editingRoomId === room.id ? <div className="flex-1 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <input type="text" value={editedRoomName} onChange={e => setEditedRoomName(e.target.value)} className="flex-1 bg-transparent border-none border-b border-white text-white outline-none focus:outline-none focus:ring-0 focus:border-none" style={{
                          borderBottom: '1px solid white'
                        }} autoFocus onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveRename(e as any, room.id);
                          if (e.key === 'Escape') handleCancelRename(e as any);
                        }} />
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => handleSaveRename(e, room.id)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancelRename}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div> : <>
                                <span className="flex-1 text-left truncate">{room.name}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={e => handleRenameClick(e, room.id)}>
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={e => handleDeleteClick(e, room.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </>}
                          </Button>)}
                      </div>
                    </PopoverContent>
                  </Popover>}
              </div>
            </div>
            
            <div className="px-4 py-2">
              <h3 className="text-white/70 text-xs font-medium mb-2 px-2">Help & Tools</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5 hover:text-white" onClick={handleFeedbackClick}>
                  <MessageCircle size={18} className="mr-2" />
                  <span>Feedback</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5 hover:text-white relative" onClick={handleTutorialClick}>
                  <Book size={18} className="mr-2" />
                  <span>Quick Guide</span>
                  {!hasSeenTutorial && <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-green-500"></span>}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5 hover:text-white" asChild>
                  <Link to="/extension">
                    <Chrome size={18} className="mr-2" />
                    <span>Chrome Extension</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 p-4 bg-[#222222]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-between w-full text-white hover:bg-white/10 p-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-[#ea384c]">
                      <AvatarFallback className="text-black">A</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden text-left">
                      <p className="truncate text-sm font-medium text-white">Azzam Sahlil</p>
                      <p className="truncate text-xs text-gray-400">Free Plan</p>
                    </div>
                  </div>
                  <ChevronUp size={16} className="text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] bg-[#1A1A1A] border border-white/10 text-white p-0 mb-1 z-50" align="end" side="top" sideOffset={5}>
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-[#ea384c]">
                      <AvatarFallback className="text-black hover:text-black">A</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Azzam Sahlil</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white"
                    onClick={() => {
                      navigate('/profile');
                      onOpenChange(false);
                    }}
                  >
                    <Settings size={16} className="mr-3 text-gray-300" />
                    <span>Settings</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white" asChild>
                    <Link to="/pricing">
                      <Tag size={16} className="mr-3 text-gray-300" />
                      <span>Pricing</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white">
                    <History size={16} className="mr-3 text-gray-300" />
                    <span>History</span>
                  </Button>
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-white/10">
                    <div className="flex items-center text-white">
                      <Moon size={16} className="mr-3 text-gray-300" />
                      <span>Dark mode</span>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-primary" />
                  </div>
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:!text-white" onClick={handleLogout}>
                    <LogOut size={16} className="mr-3 text-gray-300" />
                    <span>Log out</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </SheetContent>
      </Sheet>

      <FeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
      
      <TutorialModal open={tutorialModalOpen} onOpenChange={setTutorialModalOpen} />

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#1A1A1A] text-white border-white/10 p-6 rounded-lg shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Delete Room</h2>
          </div>
          
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete "{roomToDeleteName}"? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" className="text-white hover:bg-white/5" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500 text-white hover:bg-red-600" onClick={handleDeleteConfirm}>
              Delete Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>;
}