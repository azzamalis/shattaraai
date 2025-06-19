
import React from 'react';
import { RoomCard } from './RoomCard';
import { Room } from '@/hooks/useRooms';
import { useContentContext } from '@/contexts/ContentContext';

interface MyRoomsSectionProps {
  rooms: Room[];
  onAddRoom: () => Promise<string | null>;
  onEditRoom: (roomId: string, newName: string) => Promise<void>;
  onDeleteRoom: (roomId: string) => Promise<void>;
}

export function MyRoomsSection({
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: MyRoomsSectionProps) {
  const { content } = useContentContext();

  const getContentCountForRoom = (roomId: string): number => {
    return content.filter(item => item.room_id === roomId).length;
  };

  return (
    <section className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-foreground text-lg">My Rooms</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map(room => (
          <RoomCard 
            key={room.id} 
            id={room.id} 
            name={room.name}
            contentCount={getContentCountForRoom(room.id)}
            onDelete={onDeleteRoom} 
          />
        ))}

        {/* Add Room Button */}
        <RoomCard isAddButton onAdd={onAddRoom} />
      </div>
    </section>
  );
}
