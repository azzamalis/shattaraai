
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { History } from '@/components/history/History';
import { Room, RoomHandlers } from '@/lib/types';

export default function HistoryPage() {
  // The History component might not need these props directly,
  // but we need to ensure consistency across dashboard pages
  return (
    <DashboardLayout>
      <History />
    </DashboardLayout>
  );
}
