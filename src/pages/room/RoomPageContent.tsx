
import React from 'react';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomPageHeader } from '@/components/dashboard/RoomPageHeader';
import { RoomPageActions } from '@/components/dashboard/RoomPageActions';

interface RoomPageContentProps {
  currentRoom: any;
  roomContent: any[];
  roomId?: string;
  isExamMode: boolean;
  examStep: number;
  selectedContentIds: string[];
  handleTitleEdit: (title: string) => Promise<void>;
  handleDescriptionEdit: (description: string) => Promise<void>;
  handleContentToggle: (contentId: string) => void;
  setIsChatOpen: (open: boolean) => void;
  setIsExamMode: (mode: boolean) => void;
  handleExamCancel: () => void;
}

export function RoomPageContent({
  currentRoom,
  roomContent,
  roomId,
  isExamMode,
  examStep,
  selectedContentIds,
  handleTitleEdit,
  handleDescriptionEdit,
  handleContentToggle,
  setIsChatOpen,
  setIsExamMode,
  handleExamCancel
}: RoomPageContentProps) {
  const handleClickOutside = () => {
    // This function is passed to header for click outside handling
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-12 2xl:px-36 bg-background">
        <div className="w-full">
          <div className="group/header relative">
            {/* Header and Actions - Stack on mobile, side-by-side on xl */}
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 xl:gap-6">
              <RoomPageHeader 
                room={currentRoom}
                onTitleEdit={handleTitleEdit}
                onDescriptionEdit={handleDescriptionEdit}
                onClickOutside={handleClickOutside}
              />

              <RoomPageActions 
                onChatOpen={() => setIsChatOpen(true)}
                onExamModalOpen={() => setIsExamMode(true)}
                onExamModalClose={handleExamCancel}
                roomId={roomId}
                isExamMode={isExamMode}
              />
            </div>

            {/* Divider */}
            <div className="relative mt-4 md:mt-8">
              <div className="w-full h-px bg-border" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <RoomView 
          title={currentRoom.name} 
          description={currentRoom.description || ''} 
          isEmpty={roomContent.length === 0} 
          hideHeader={true}
          isExamSelectionMode={isExamMode && examStep === 1}
          selectedContentIds={selectedContentIds}
          onContentSelectionChange={handleContentToggle}
        />
      </div>
    </div>
  );
}
