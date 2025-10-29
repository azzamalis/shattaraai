import React from 'react';
import { LearningCard } from '@/components/dashboard/LearningCard';
import { HistoryItem } from './HistoryTable';
import { Room } from '@/lib/types';
import { HistoryEmptyState } from './HistoryEmptyState';

interface HistoryGridProps {
  items: HistoryItem[];
  rooms: Room[];
  onItemClick: (id: string) => void;
  onAddToRoom: (contentId: string, roomId: string) => void;
  onDelete: (id: string) => void;
  searchQuery?: string;
  onClearFilters?: () => void;
}

export function HistoryGrid({
  items,
  rooms,
  onItemClick,
  onAddToRoom,
  onDelete,
  searchQuery = '',
  onClearFilters
}: HistoryGridProps) {
  if (items.length === 0) {
    return (
      <HistoryEmptyState
        hasSearch={!!searchQuery}
        searchQuery={searchQuery}
        onClearFilters={onClearFilters}
        viewMode="grid"
      />
    );
  }

  // Convert HistoryItem to ContentItem format for LearningCard
  const contentItems = items.map(item => ({
    id: item.id,
    title: item.title,
    type: item.type as 'audio_file' | 'chat' | 'file' | 'live_recording' | 'pdf' | 'recording' | 'text' | 'upload' | 'video' | 'website' | 'youtube',
    created_at: item.date.toISOString(),
    url: item.url,
    metadata: {},
    room_id: rooms.find(r => r.name === item.room)?.id,
    user_id: '',
    updated_at: item.date.toISOString(),
    status: 'completed' as const
  }));

  return (
    <div className="px-4 sm:pl-0 sm:pr-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-5 gap-8">
        {contentItems.map(content => (
          <LearningCard
            key={content.id}
            content={content}
            onDelete={() => onDelete(content.id)}
            onShare={() => {}}
            onAddToRoom={(roomId) => onAddToRoom(content.id, roomId)}
            availableRooms={rooms}
          />
        ))}
      </div>
    </div>
  );
}
