
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { History } from '@/components/history/History';

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <div className="h-full bg-background transition-colors duration-300">
        <History />
      </div>
    </DashboardLayout>
  );
}
