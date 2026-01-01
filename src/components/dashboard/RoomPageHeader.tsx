
import React, { useState } from 'react';
import { Smile, Image, MoreHorizontal } from 'lucide-react';
import { Room } from '@/hooks/useRooms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RoomPageHeaderProps {
  room: Room;
  onTitleEdit: (newTitle: string) => Promise<void>;
  onDescriptionEdit: (newDescription: string) => Promise<void>;
  onClickOutside: () => void;
}

export const RoomPageHeader: React.FC<RoomPageHeaderProps> = ({
  room,
  onTitleEdit,
  onDescriptionEdit,
  onClickOutside
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const handleTitleEditStart = () => {
    setEditedTitle(room.name);
    setIsEditingTitle(true);
  };

  const handleDescriptionEditStart = () => {
    setEditedDescription(room.description || '');
    setIsEditingDescription(true);
  };

  const handleTitleSave = async () => {
    if (editedTitle.trim()) {
      await onTitleEdit(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = async () => {
    await onDescriptionEdit(editedDescription.trim());
    setIsEditingDescription(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
  };

  const handleDescriptionCancel = () => {
    setIsEditingDescription(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDescriptionSave();
    } else if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  const handleClickOutsideInternal = () => {
    if (isEditingTitle || isEditingDescription) {
      if (isEditingTitle) handleTitleCancel();
      if (isEditingDescription) handleDescriptionCancel();
    }
    onClickOutside();
  };

  return (
    <div onClick={handleClickOutsideInternal} className="flex min-w-0 flex-1 flex-col space-y-1">
      {/* Quick actions - Desktop: show on hover, Mobile: show in dropdown */}
      <div className="mb-2 flex gap-2">
        {/* Desktop buttons - hidden on mobile, show on hover */}
        <button className="hidden lg:inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground opacity-100 xl:opacity-0 xl:group-hover/header:opacity-100 transition-opacity duration-200 hover:bg-muted hover:text-foreground">
          <Smile className="h-3 w-3" />
          Add icon
        </button>
        <button className="hidden lg:inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground opacity-100 xl:opacity-0 xl:group-hover/header:opacity-100 transition-opacity duration-200 hover:bg-muted hover:text-foreground">
          <Image className="h-3 w-3" />
          Add cover
        </button>

        {/* Mobile dropdown */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md p-2 text-sm text-muted-foreground opacity-100 xl:opacity-0 xl:group-hover/header:opacity-100 transition-opacity duration-200 hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 rounded-xl">
              <DropdownMenuItem className="gap-2 rounded-lg">
                <Smile className="h-4 w-4" />
                Add icon
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg">
                <Image className="h-4 w-4" />
                Add cover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title - Click to edit */}
      <div className="group mb-2 flex w-full flex-row items-center text-lg md:text-2xl lg:text-3xl">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleSave}
            onClick={(e) => e.stopPropagation()}
            className="-ml-1 px-1 w-full font-medium text-foreground bg-transparent border-none outline-none focus:ring-0"
            placeholder="Untitled Space"
            autoFocus
          />
        ) : (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleTitleEditStart();
            }}
            className="-ml-1 px-1 cursor-text rounded-md transition-colors hover:bg-muted font-medium"
          >
            {room.name || 'Untitled Space'}
          </span>
        )}
      </div>

      {/* Description - Click to edit */}
      <div className="flex w-full">
        <div className="flex w-full flex-col">
          <div className="-ml-1 line-clamp-2 flex w-full break-words text-sm text-muted-foreground sm:text-base">
            <div className="group flex w-full flex-row">
              {isEditingDescription ? (
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  onKeyDown={handleDescriptionKeyDown}
                  onBlur={handleDescriptionSave}
                  onClick={(e) => e.stopPropagation()}
                  className="px-1 w-full text-muted-foreground bg-transparent border-none outline-none focus:ring-0"
                  placeholder="Add a description"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDescriptionEditStart();
                  }}
                  className="px-1 cursor-text rounded-sm transition-colors hover:bg-muted"
                >
                  {room.description || 'No description'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
