
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Room, RoomHandlers } from '@/lib/types';

export default function DashboardPage() {
  // The actual values will be provided by DashboardLayout
  // We just need to make sure the component structure accepts the props
  return (
    <DashboardLayout>
      <Dashboard 
        rooms={[]} 
        onAddRoom={() => {}}
        onEditRoom={() => {}}
        onDeleteRoom={() => {}}
      />
    </DashboardLayout>
  );
}
