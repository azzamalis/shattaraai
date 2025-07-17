import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Room } from '@/hooks/useRooms';
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
  return <div onClick={handleClickOutsideInternal} className="flex items-start gap-2 flex-1 min-w-0">
      <div className="group">
        <div className="flex items-center gap-3 mb-2">
          {isEditingTitle ? <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} onKeyDown={handleTitleKeyDown} onClick={e => e.stopPropagation()} className="text-2xl font-bold text-foreground bg-transparent border-none outline-none focus:ring-0 p-0 w-full" placeholder="Untitled Room" autoFocus /> : <>
              <h1 className="text-foreground text-2xl font-medium truncate min-w-0 max-w-full">{room.name}</h1>
              <button onClick={e => {
            e.stopPropagation();
            handleTitleEditStart();
          }} className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all duration-200">
                <Pencil className="h-4 w-4" />
              </button>
            </>}
        </div>
        
        {isEditingDescription ? <input type="text" value={editedDescription} onChange={e => setEditedDescription(e.target.value)} onKeyDown={handleDescriptionKeyDown} onClick={e => e.stopPropagation()} className="text-muted-foreground bg-transparent border-none outline-none focus:ring-0 p-0 w-full" placeholder="Add a description" autoFocus /> : <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm font-medium">
              {room.description || "No description"}
            </p>
            <button onClick={e => {
          e.stopPropagation();
          handleDescriptionEditStart();
        }} className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all duration-200">
              <Pencil className="h-4 w-4" />
            </button>
          </div>}
      </div>
    </div>;
};