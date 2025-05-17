
import React from 'react';
import { Box, Plus, Trash2 } from 'lucide-react';

interface Room {
  id: string;
  name: string;
}

interface LearningRoomsProps {
  rooms: Room[];
  onDeleteRoom: (roomName: string) => void;
}

export const LearningRooms: React.FC<LearningRoomsProps> = ({ rooms, onDeleteRoom }) => {
  const leftRooms = rooms.filter((_, index) => index % 2 === 0);
  const rightRooms = rooms.filter((_, index) => index % 2 === 1);

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-lg font-medium text-white mb-4">My Rooms</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Left Column */}
        <div className="space-y-2">
          {leftRooms.map(room => (
            <div key={room.id} className="flex items-center justify-between p-3 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] transition-colors group cursor-pointer">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-white/60" />
                <span className="text-white text-sm">{room.name}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRoom(room.name);
                }} 
                className="p-1"
              >
                <Trash2 className="h-4 w-4 text-red-700" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {rightRooms.map(room => (
            <div key={room.id} className="flex items-center justify-between p-3 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] transition-colors group cursor-pointer">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-white/60" />
                <span className="text-white text-sm">{room.name}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRoom(room.name);
                }} 
                className="p-1"
              >
                <Trash2 className="h-4 w-4 text-red-700" />
              </button>
            </div>
          ))}

          {/* Add Room Button */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-white/60" />
              <span className="text-white text-sm">Add a Room</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
