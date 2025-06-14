
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  // The actual values will be provided by DashboardLayout
  // We just need to make sure the component structure accepts the props
  return (
    <DashboardLayout className="p-0">
      <Dashboard 
        rooms={[]} 
        onAddRoom={async () => null}
        onEditRoom={async () => {}}
        onDeleteRoom={async () => {}}
      />
    </DashboardLayout>
  );
}
