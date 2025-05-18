import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText } from 'lucide-react';
export default function RoomPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();

  // In a real app, you would fetch the room data based on the ID
  const room = {
    title: id === "physics" ? "Physics" : "Mathematics",
    description: id === "physics" ? "Classical mechanics and kinematics" : "Calculus and linear algebra"
  };
  return <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Hero Section at the top */}
        <RoomHeroSection title={room.title} description={room.description} />
        
        {/* Room Title, Description and Action Buttons */}
        <div className="bg-[#111] px-4 py-6 border-b border-white/10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-white">{room.title}</h1>
                <p className="text-gray-400 mt-1">{room.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-gray-300 hover:border-primary bg-transparent text-white">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Room Chat
                </Button>
                <Button className="bg-primary hover:bg-primary-light text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Exam
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Room Content */}
        <RoomView title={room.title} description={room.description} isEmpty={id === "physics"} hideHeader={true} // Hide the header since we now have our own header section
      />
      </div>
    </DashboardLayout>;
}