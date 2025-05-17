
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  // Add debugging info
  useEffect(() => {
    console.log("DashboardPage rendered - Auth state:", { user: user?.email, isLoading });
  }, [user, isLoading]);

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
