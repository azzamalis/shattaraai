import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { History } from '@/components/history/History';
import { Room, RoomHandlers } from '@/lib/types';

interface HistoryPageProps {
  rooms: Room[];
  roomHandlers: RoomHandlers;
}

export default function HistoryPage({ rooms, roomHandlers }: HistoryPageProps) {
  return (
    <DashboardLayout>
      <div className="h-full bg-background transition-colors duration-300">
        <History rooms={rooms} roomHandlers={roomHandlers} />
      </div>
    </DashboardLayout>
  );
}
