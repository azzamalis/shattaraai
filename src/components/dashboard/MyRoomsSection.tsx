import React from 'react';
import { RoomCard } from './RoomCard';
import { Room } from '@/lib/types';
interface MyRoomsSectionProps {
  rooms: Room[];
  onAddRoom: () => void;
  onEditRoom: (roomId: string, newName: string) => void;
  onDeleteRoom: (roomId: string) => void;
}
export function MyRoomsSection({
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: MyRoomsSectionProps) {
  return <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl mb-4 text-neutral-950 font-semibold">My rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map(room => <RoomCard key={room.id} id={room.id} name={room.name} formattedDate={`Last active: ${room.lastActive}`} onEdit={onEditRoom} onDelete={onDeleteRoom} />)}

        {/* Add Room Button */}
        <RoomCard isAddButton onAdd={onAddRoom} />
      </div>
    </div>;
}