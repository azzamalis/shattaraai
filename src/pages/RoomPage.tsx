import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomView } from '@/components/dashboard/RoomView';
import { useParams } from 'react-router-dom';

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch the room data based on the ID
  const room = {
    title: id === "physics" ? "Physics" : "Mathematics",
    description: id === "physics" 
      ? "Classical mechanics and kinematics" 
      : "Calculus and linear algebra",
  };

  return (
    <DashboardLayout>
      <RoomView 
        title={room.title} 
        description={room.description} 
        isEmpty={id === "physics"} 
      />
    </DashboardLayout>
  );
} 