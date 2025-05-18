
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
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
      <div className="flex flex-col h-full">
        <RoomHeroSection title={room.title} description={room.description} />
        <RoomView 
          title={room.title} 
          description={room.description} 
          isEmpty={id === "physics"} 
          hideHeader={true} // Hide the header since we now have the hero section
        />
      </div>
    </DashboardLayout>
  );
} 
