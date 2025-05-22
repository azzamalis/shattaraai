import React, { useState } from 'react';
import { Room, RoomHandlers, DeleteItem } from '@/lib/types';
import { toast } from "sonner";
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { NewFeaturePromo } from './NewFeaturePromo';
import { ActionCards } from './ActionCards';
import { MyRoomsSection } from './MyRoomsSection';
import { ContinueLearningSection } from './ContinueLearningSection';
import { ShareModal } from './modals/ShareModal';
import { DeleteConfirmModal } from './modals/DeleteConfirmModal';
interface DashboardProps extends RoomHandlers {
  rooms: Room[];
}
export function Dashboard({
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: DashboardProps) {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
  const handlePasteSubmit = (data: {
    url?: string;
    text?: string;
  }) => {
    // Handle the submitted data here
    if (data.url) {
      toast.success("URL content added successfully");
    } else if (data.text) {
      toast.success("Text content added successfully");
    }
  };
  const handleAISubmit = (value: string) => {
    toast.success("Your question was submitted");
    console.log("AI query:", value);
    // Here you would typically send the query to your AI backend
  };
  const handleDeleteClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setItemToDelete({
        id: room.id,
        type: 'room',
        name: room.name
      });
      setDeleteModalOpen(true);
    }
  };
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'room') {
      onDeleteRoom(itemToDelete.id);
      toast.success(`"${itemToDelete.name}" has been deleted`);
    } else if (itemToDelete.type === 'card') {
      // Handle card deletion here when implemented
      toast.success(`"${itemToDelete.name}" has been deleted from ${itemToDelete.parentName}`);
    }
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };
  const handleCardDelete = () => {
    setItemToDelete({
      id: 'python-card',
      type: 'card',
      name: 'Python Language',
      parentName: "Azzam's Space"
    });
    setDeleteModalOpen(true);
  };
  return <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Practice with exams section */}
          <NewFeaturePromo />
          
          {/* Centered main heading with responsive font size */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-12 text-center">
            What do you want to learn today?
          </h1>
          
          {/* Action Cards */}
          <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
          
          {/* AI Assistant Input */}
          <div className="mb-6 sm:mb-8">
            <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
          </div>

          {/* My Rooms section */}
          <MyRoomsSection rooms={rooms} onAddRoom={onAddRoom} onEditRoom={onEditRoom} onDeleteRoom={handleDeleteClick} />

          {/* Continue learning section */}
          <ContinueLearningSection onDeleteCard={handleCardDelete} onShareCard={() => setShareModalOpen(true)} />
        </div>
      </main>

      {/* Modals */}
      <PasteContentModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onSubmit={handlePasteSubmit} />
      
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
      
      <DeleteConfirmModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} itemToDelete={itemToDelete} onConfirm={handleDeleteConfirm} />
    </div>;
}