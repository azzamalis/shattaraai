
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SpaceView } from '@/components/dashboard/SpaceView';
import { useParams } from 'react-router-dom';

export default function SpacePage() {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch the space data based on the ID
  // For now, we'll use placeholder data
  const space = {
    title: id === "physics" ? "Physics" : "Mathematics",
    description: id === "physics" 
      ? "Classical mechanics and kinematics" 
      : "Calculus and linear algebra",
  };

  return (
    <DashboardLayout>
      <SpaceView 
        title={space.title} 
        description={space.description} 
        isEmpty={id === "physics"} 
      />
    </DashboardLayout>
  );
}
