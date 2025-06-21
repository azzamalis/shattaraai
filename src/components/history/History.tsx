
import React, { useState, useMemo } from 'react';
import { HistoryHeader } from './HistoryHeader';
import { HistoryTable, HistoryItem } from './HistoryTable';
import { HistoryFilter } from './HistoryFilter';
import { useContent } from '@/contexts/ContentContext';
import { useRooms } from '@/hooks/useRooms';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function History() {
  const navigate = useNavigate();
  const { content, onDeleteContent, onUpdateContent } = useContent();
  const { rooms } = useRooms();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');

  // Convert content to history items
  const historyItems: HistoryItem[] = useMemo(() => {
    return content.map(item => ({
      id: item.id,
      title: item.title,
      room: item.room_id ? rooms.find(r => r.id === item.room_id)?.name || 'Unknown Room' : 'No Room',
      date: new Date(item.created_at),
      type: item.type,
      url: item.url
    }));
  }, [content, rooms]);

  // Filter items based on search query, type, and room
  const filteredItems = useMemo(() => {
    return historyItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesRoom = selectedRoom === 'all' || 
        (selectedRoom === 'no-room' && item.room === 'No Room') ||
        item.room === selectedRoom;
      
      return matchesSearch && matchesType && matchesRoom;
    });
  }, [historyItems, searchQuery, selectedType, selectedRoom]);

  const handleItemClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteContent(id);
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleAddToRoom = async (contentId: string, roomId: string) => {
    try {
      await onUpdateContent(contentId, { room_id: roomId });
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedRoom('all');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <HistoryHeader />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col max-w-7xl mx-auto px-6">
          <HistoryFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
            rooms={rooms}
            totalItems={filteredItems.length}
          />
          
          <div className="flex-1 overflow-auto">
            <HistoryTable
              items={filteredItems}
              onItemClick={handleItemClick}
              rooms={rooms}
              onAddToRoom={handleAddToRoom}
              onDelete={handleDelete}
              searchQuery={searchQuery}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
