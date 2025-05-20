
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Share2, Download } from "lucide-react";
import { Room } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface RecordingHeaderProps {
  currentTime: string;
  isRecording: boolean;
  toggleRecording: () => void;
  recordingTime: string;
  selectedMicrophone: string;
  onMicrophoneSelect: (value: string) => void;
  onMicrophoneClear?: () => void;
  rooms?: Room[];
}

const RecordingHeader = ({
  currentTime,
  isRecording,
  rooms = [],
}: RecordingHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState(`Recording at ${currentTime}`);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [saveDropdownOpen, setSaveDropdownOpen] = useState(false);

  const handleTitleEdit = () => {
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setRecordingTitle(`Recording at ${currentTime}`);
    }
  };

  const handleSaveToRoom = (roomId: string) => {
    // Save to room functionality
    setSaveDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4 border-b border-white/10 bg-black">
      <div className="flex items-center justify-between w-full mb-1">
        <div className="flex items-center min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={recordingTitle}
              onChange={(e) => setRecordingTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleSave}
              className="text-white text-sm font-medium bg-transparent border-none border-b border-white/20 focus:border-white/40 outline-none focus:outline-none focus:ring-0 min-w-0"
              autoFocus
            />
          ) : (
            <h1 className="text-white text-sm font-medium truncate">
              {recordingTitle}
              {isRecording && <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
            </h1>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleTitleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Popover open={saveDropdownOpen} onOpenChange={setSaveDropdownOpen}>
            <PopoverTrigger asChild>
              <Button className="bg-transparent hover:bg-white/10 border border-white/20 text-white" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[200px] bg-[#1A1A1A] border-white/10 p-1 z-50"
              side="bottom"
              align="end"
              sideOffset={5}
            >
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <Button
                      key={room.id}
                      variant="ghost"
                      className="w-full flex items-center justify-between px-2 py-1.5 
                        text-white hover:bg-white/5 transition-colors duration-200"
                      onClick={() => handleSaveToRoom(room.id)}
                    >
                      <span className="flex-1 text-left truncate">{room.name}</span>
                    </Button>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-white/60 text-sm">
                    No rooms available
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button 
            className="bg-transparent hover:bg-white/10 border border-white/20 text-white" 
            size="sm"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="bg-[#1A1A1A] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Share Recording</DialogTitle>
            <DialogDescription className="text-white/70">
              Share this recording with your team or friends.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <input 
              type="text" 
              value="https://your-app.com/shared/recording-123" 
              readOnly
              className="w-full bg-[#111] border border-white/10 rounded p-2 text-white"
            />
            <div className="flex justify-end mt-4">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordingHeader;
