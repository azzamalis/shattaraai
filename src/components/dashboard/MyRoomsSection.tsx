import React from 'react';
import { RoomCard } from './RoomCard';
import { Room } from '@/lib/types';

interface MyRoomsSectionProps {
  rooms: Room[];
  onAddRoom: () => void;
  onEditRoom: (roomId: string, newName: string) => void;
  onDeleteRoom: (roomId: string) => void;
}

export function MyRoomsSection({ rooms, onAddRoom, onEditRoom, onDeleteRoom }: MyRoomsSectionProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#232323] dark:text-white transition-colors duration-200">My rooms</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map(room => (
          <RoomCard
            key={room.id}
            id={room.id}
            name={room.name}
            onDelete={onDeleteRoom}
          />
        ))}

        {/* Add Room Button */}
        <RoomCard
          isAddButton
          onAdd={onAddRoom}
        />
      </div>
    </div>
  );
}
