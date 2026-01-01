
import React, { useState } from 'react';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomPageHeader } from '@/components/dashboard/RoomPageHeader';
import { RoomPageActions } from '@/components/dashboard/RoomPageActions';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';

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
  handleToggleSelectAll: () => void;
  handleExamNext: () => void;
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
  handleExamCancel,
  handleToggleSelectAll,
  handleExamNext
}: RoomPageContentProps) {
  const [showHeroSection, setShowHeroSection] = useState(false);

  const handleClickOutside = () => {
    // This function is passed to header for click outside handling
  };

  const handleAddContentClick = () => {
    setShowHeroSection(prev => !prev);
  };

  // Calculate exam mode data
  const selectedCount = selectedContentIds.length;
  const totalCount = roomContent.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden pt-6 sm:pt-8">
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
                onAddContent={handleAddContentClick}
                isAddContentActive={showHeroSection}
              />
            </div>

            {/* Divider */}
            <div className="relative mt-4 md:mt-8">
              <div className="w-full h-px bg-border" />
            </div>

            {/* Hero Section - conditionally rendered */}
            {(showHeroSection || (isExamMode && examStep === 1)) && (
              <div className="py-6 sm:py-8">
                <RoomHeroSection 
                  title={currentRoom.name} 
                  description={currentRoom.description || ''} 
                  isExamMode={isExamMode}
                  examStep={examStep}
                  examModeData={isExamMode ? {
                    selectedCount,
                    totalCount,
                    isAllSelected,
                    onToggleSelectAll: handleToggleSelectAll,
                    onNext: handleExamNext,
                    onCancel: handleExamCancel
                  } : undefined}
                />
              </div>
            )}
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
