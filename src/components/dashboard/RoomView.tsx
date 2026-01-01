
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ActionCards } from './ActionCards';
import { LearningCard } from './LearningCard';
import { PasteContentModal } from './PasteContentModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { ContentItem } from '@/hooks/useContent';
import { LayoutGrid, Menu } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RoomViewProps {
  title: string;
  description: string;
  isEmpty?: boolean;
  hideHeader?: boolean;
  // Selection mode props
  isExamSelectionMode?: boolean;
  selectedContentIds?: string[];
  onContentSelectionChange?: (contentId: string) => void;
}

export function RoomView({
  title,
  description,
  isEmpty = false,
  hideHeader = false,
  isExamSelectionMode = false,
  selectedContentIds = [],
  onContentSelectionChange
}: RoomViewProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    content,
    onAddContent,
    onAddContentWithMetadata,
    onDeleteContent,
    onUpdateContent
  } = useContent();
  const { rooms } = useRooms();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter content to only show items that belong to this specific room
  const roomContent = content.filter(item => item.room_id === roomId);

  const handlePasteSubmit = async (data: {
    url?: string;
    text?: string;
  }) => {
    let contentType = 'text';
    let contentTitle = 'Text Content';
    let metadata = {};
    
    if (data.url) {
      if (data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
        contentType = 'youtube';
        contentTitle = 'YouTube Video';
        metadata = {
          url: data.url,
          type: 'youtube',
          extractedAt: new Date().toISOString()
        };
      } else {
        contentType = 'website';
        contentTitle = 'Website Content';
        metadata = {
          url: data.url,
          type: 'website',
          extractedAt: new Date().toISOString()
        };
      }
    } else if (data.text) {
      metadata = {
        textLength: data.text.length,
        type: 'text',
          createdAt: new Date().toISOString()
      };
    }

    // Use addContentWithMetadata to store pasted content with metadata in storage
    const contentData = {
      title: contentTitle,
      type: contentType as any,
      room_id: roomId, // Assign to current room
      metadata,
      url: data.url,
      text_content: data.text
    };

    const urlMetadata = data.url ? { url: data.url, extractedAt: new Date().toISOString() } : undefined;
    const contentId = await onAddContentWithMetadata(contentData, urlMetadata);

    if (contentId) {
      const searchParams = new URLSearchParams({
        type: contentType,
        ...(data.url && { url: data.url }),
        ...(data.text && { text: data.text })
      });
      navigate(`/content/${contentId}?${searchParams.toString()}`);
      if (data.url) {
        toast.success("URL content added successfully");
      } else if (data.text) {
        toast.success("Text content added successfully");
      }
    }
    setIsPasteModalOpen(false);
  };

  const handleDeleteCard = (item: ContentItem) => {
    onDeleteContent(item.id);
  };

  const handleShareCard = (item: ContentItem) => {
    // Handle share functionality
  };

  const handleAddToRoom = async (item: ContentItem, targetRoomId: string) => {
    try {
      await onUpdateContent(item.id, { room_id: targetRoomId });
      const room = rooms.find(r => r.id === targetRoomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  };

  const renderContent = () => {
    if (roomContent.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            {isExamSelectionMode ? "No content available for exam creation" : "No content in this room yet"}
          </p>
          {!isExamSelectionMode && (
            <p className="text-muted-foreground">Add content to this room using the "Add" option on any content card</p>
          )}
        </div>
      );
    }

    const gridClasses = viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-6 gap-4 sm:gap-8"
      : "flex flex-col gap-4";

    return (
      <div className={gridClasses}>
        {roomContent.map(item => (
          <LearningCard
            key={item.id}
            content={item}
            onDelete={() => handleDeleteCard(item)}
            onShare={() => handleShareCard(item)}
            onAddToRoom={targetRoomId => handleAddToRoom(item, targetRoomId)}
            availableRooms={rooms}
            isExamSelectionMode={isExamSelectionMode}
            isSelected={selectedContentIds.includes(item.id)}
            onToggleSelection={onContentSelectionChange}
          />
        ))}
      </div>
    );
  };

  if (!hideHeader) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        {!isExamSelectionMode && (
          <div className="mb-8">
            <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
          </div>
        )}

        {renderContent()}

        <PasteContentModal
          isOpen={isPasteModalOpen}
          onClose={() => setIsPasteModalOpen(false)}
          onSubmit={handlePasteSubmit}
        />
      </div>
    );
  }

  // When hideHeader is true, show content grid with view toggle
  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 2xl:px-36 py-4">
      {/* View toggle aligned to the right */}
      <div className="flex w-full items-center justify-end mb-4 mt-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
          <TabsList className="rounded-full px-2 bg-muted">
            <TabsTrigger 
              value="grid" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg px-3 py-1.5"
            >
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg px-3 py-1.5"
            >
              <Menu className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content grid */}
      <div className="h-full w-full mb-10">
        {renderContent()}
      </div>
    </div>
  );
}
