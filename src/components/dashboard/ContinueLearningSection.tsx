import React from 'react';
import { LearningCard } from './LearningCard';
import { useContent } from '@/contexts/ContentContext';
import { cn } from '@/lib/utils';
import { ContentItem } from '@/hooks/useContent';
import { useNavigate } from 'react-router-dom';
interface ContinueLearningProps {
  onDeleteCard: (item: ContentItem) => void;
  onShareCard: (item: ContentItem) => void;
  onAddToRoom?: (item: ContentItem, roomId: string) => void;
  availableRooms?: Array<{
    id: string;
    name: string;
  }>;
  currentRoom?: {
    id: string;
    name: string;
  };
}
export function ContinueLearningSection({
  onDeleteCard,
  onShareCard,
  onAddToRoom,
  availableRooms = [],
  currentRoom
}: ContinueLearningProps) {
  const {
    content
  } = useContent();
  const navigate = useNavigate();
  const handleAddToRoom = (roomId: string, item: ContentItem) => {
    if (onAddToRoom) {
      onAddToRoom(item, roomId);
    }
  };
  const handleViewAll = () => {
    navigate('/history');
  };

  // Show all content in the Continue Learning section regardless of room assignment
  // This allows users to see and manage all their content from the main dashboard
  if (content.length === 0) {
    return <section className="w-full py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-foreground text-lg">Continue Learning</h2>
        </div>
        <div className="text-muted-foreground text-center py-12 rounded-xl border border-border/5 bg-transparent">
          No content yet. Upload, paste, or record something to get started!
        </div>
      </section>;
  }
  return <section className="w-full mb-11">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-foreground text-sm font-medium">Continue Learning</h2>
        <button onClick={handleViewAll} className="inline-flex items-center justify-center w-20 h-9 rounded-xl text-sm px-3 text-center cursor-pointer transition-colors hover:bg-accent/50">
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-5 gap-4">
        {content.map(item => <LearningCard key={item.id} content={item} onDelete={() => onDeleteCard(item)} onShare={() => onShareCard(item)} onAddToRoom={roomId => handleAddToRoom(roomId, item)} availableRooms={availableRooms} currentRoom={currentRoom} />)}
      </div>
    </section>;
}