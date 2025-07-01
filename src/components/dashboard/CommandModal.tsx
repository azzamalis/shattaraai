import React, { useRef } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Mic,
  Upload,
  Box,
  FileText,
  Video,
  Globe,
  Youtube,
  MessageSquare,
  Music,
  Type
} from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { Room } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
  onAddRoom: () => Promise<string | null>;
}

// Helper function to get the appropriate icon for content type
const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    case 'pdf':
    case 'file':
      return <FileText size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    case 'recording':
    case 'live_recording':
      return <Mic size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    case 'youtube':
      return <Youtube size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    case 'website':
      return <Globe size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    case 'text':
      return <Type size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    case 'audio_file':
      return <Music size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    case 'chat':
      return <MessageSquare size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
    default:
      return <FileText size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />;
  }
};

export function CommandModal({ open, onOpenChange, rooms, onAddRoom }: CommandModalProps) {
  const navigate = useNavigate();
  const { recentContent, addContent, addContentWithFile } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
    onOpenChange(false);
  };

  const handleContentClick = (contentId: string, type: string) => {
    // Route to chat page for chat content types, otherwise to content page
    if (type === 'chat') {
      navigate(`/chat/${contentId}`);
    } else {
      navigate(`/content/${contentId}?type=${type}`);
    }
    onOpenChange(false);
  };

  const handleAddRoom = async () => {
    try {
      const roomId = await onAddRoom();
      if (roomId) {
        onOpenChange(false);
        // Add delay before navigation to ensure room is created in Supabase
        setTimeout(() => {
          navigate(`/rooms/${roomId}`);
        }, 800);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
  };

  const handleNewRecording = async () => {
    try {
      // Add live recording to tracking system WITHOUT auto-assigning to any room
      const contentId = await addContent({
        title: `Live Recording at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        type: 'live_recording',
        room_id: null, // Do not auto-assign to any room
        metadata: {
          isLiveRecording: true,
          recordingStatus: 'ready'
        }
      });

      if (contentId) {
        onOpenChange(false);
        navigate(`/content/${contentId}?type=live_recording`);
        toast.success('Recording session created');
      } else {
        throw new Error('Failed to create recording session');
      }
    } catch (error) {
      console.error('Error creating recording session:', error);
      toast.error('Failed to create recording session. Please try again.');
    }
  };

  const handleUploadClick = () => {
    onOpenChange(false);
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Determine content type based on file type and extension
        let contentType = 'upload';
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        
        if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
          contentType = 'pdf';
        } else if (fileType.includes('audio') || ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'].some(ext => fileName.endsWith(ext))) {
          contentType = 'audio_file';
        } else if (fileType.includes('video') || ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].some(ext => fileName.endsWith(ext))) {
          contentType = 'video';
        } else if (['.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx'].some(ext => fileName.endsWith(ext))) {
          contentType = 'file';
        }

        console.log('Starting file upload:', file.name, 'Type:', contentType, 'File type:', fileType);

        // Show loading toast
        const loadingToast = toast.loading(`Uploading ${file.name}...`);

        // Use addContentWithFile for ALL file uploads to ensure proper storage handling
        const contentId = await addContentWithFile({
          title: file.name,
          type: contentType as any,
          room_id: null, // Do not auto-assign to any room
          metadata: {
            fileSize: file.size,
            fileType: file.type,
            isUploadedFile: true,
            uploadedAt: new Date().toISOString()
          },
          filename: file.name
        }, file);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        console.log('Content created with ID:', contentId);

        if (contentId) {
          // Add a small delay to ensure database transaction is complete
          setTimeout(() => {
            console.log('Navigating to content page:', contentId);
            navigate(`/content/${contentId}`);
            toast.success(`File "${file.name}" uploaded successfully`);
          }, 100);
        } else {
          throw new Error('Failed to create content - no ID returned');
        }
      } catch (error) {
        console.error('Error handling file upload:', error);
        toast.error('Failed to upload the file. Please try again.');
      }
    }
  };

  return (
    <>
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.csv,.xls,.xlsx,audio/*,video/*,image/*" 
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
      />
      
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick start">
            <CommandItem onSelect={handleNewRecording}>
              <Mic size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>New Recording</span>
            </CommandItem>
            <CommandItem onSelect={handleUploadClick}>
              <Upload size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Upload Content</span>
            </CommandItem>
            <CommandItem onSelect={handleAddRoom}>
              <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Add a Room</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent">
            {recentContent && recentContent.length > 0 ? (
              recentContent.slice(0, 5).map((content) => (
                <CommandItem 
                  key={content.id}
                  onSelect={() => handleContentClick(content.id, content.type)}
                >
                  {getContentTypeIcon(content.type)}
                  <span>{content.title}</span>
                  {content.room_id && (
                    <div className="ms-auto flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5">
                        <Box size={12} />
                        <span className="text-xs text-foreground">
                          {rooms.find(r => r.id === content.room_id)?.name || 'Unknown Room'}
                        </span>
                      </div>
                    </div>
                  )}
                </CommandItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No recent content
              </div>
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Rooms">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <CommandItem 
                  key={room.id}
                  onSelect={() => handleRoomClick(room.id)}
                >
                  <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                  <span>Go to {room.name}</span>
                </CommandItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No rooms available
              </div>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
