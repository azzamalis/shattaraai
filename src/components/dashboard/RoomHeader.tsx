
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText, BarChart3, Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface RoomHeaderProps {
  room: {
    title: string;
    description: string;
  };
  onRoomUpdate: (updatedRoom: { title: string; description: string }) => void;
  onChatClick: () => void;
  onExamClick: () => void;
}

export function RoomHeader({ room, onRoomUpdate, onChatClick, onExamClick }: RoomHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const handleTitleEdit = () => {
    setEditedTitle(room.title);
    setIsEditingTitle(true);
  };

  const handleDescriptionEdit = () => {
    setEditedDescription(room.description);
    setIsEditingDescription(true);
  };

  const handleTitleSave = () => {
    const newTitle = editedTitle.trim() || "Untitled Room";
    onRoomUpdate({
      ...room,
      title: newTitle
    });
    toast.success("Room title updated successfully");
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    onRoomUpdate({
      ...room,
      description: editedDescription.trim()
    });
    toast.success("Room description updated successfully");
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

  const handleClickOutside = () => {
    if (isEditingTitle) {
      handleTitleCancel();
    }
    if (isEditingDescription) {
      handleDescriptionCancel();
    }
  };

  return (
    <div className="border-b border-dashboard-separator bg-dashboard-bg px-6 py-6" onClick={handleClickOutside}>
      <div className="flex items-start justify-between">
        {/* Left side - Room info */}
        <div className="flex-1 min-w-0 mr-6">
          <div className="group">
            <div className="flex items-center gap-3 mb-2">
              {isEditingTitle ? (
                <input 
                  type="text" 
                  value={editedTitle} 
                  onChange={e => setEditedTitle(e.target.value)} 
                  onKeyDown={handleTitleKeyDown}
                  onClick={e => e.stopPropagation()}
                  className="text-2xl font-bold text-dashboard-text bg-transparent border-none outline-none focus:ring-0 p-0 w-full" 
                  placeholder="Untitled Room" 
                  autoFocus 
                />
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-dashboard-text">{room.title}</h1>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTitleEdit();
                    }}
                    className="p-1.5 text-dashboard-text/30 opacity-0 group-hover:opacity-100 hover:text-dashboard-text/70 transition-all duration-200"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isEditingDescription ? (
                <input 
                  type="text" 
                  value={editedDescription} 
                  onChange={e => setEditedDescription(e.target.value)} 
                  onKeyDown={handleDescriptionKeyDown}
                  onClick={e => e.stopPropagation()}
                  className="text-dashboard-text-secondary bg-transparent border-none outline-none focus:ring-0 p-0 w-full" 
                  placeholder="Add a description" 
                  autoFocus 
                />
              ) : (
                <>
                  <p className="text-dashboard-text-secondary">
                    {room.description || "No description"}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDescriptionEdit();
                    }}
                    className="p-1.5 text-dashboard-text/30 opacity-0 group-hover:opacity-100 hover:text-dashboard-text/70 transition-all duration-200"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-dashboard-separator bg-dashboard-card text-dashboard-text hover:bg-dashboard-card-hover"
            onClick={(e) => {
              e.stopPropagation();
              onChatClick();
            }}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Space Chat
          </Button>
          <Button 
            variant="outline" 
            className="border-dashboard-separator bg-dashboard-card text-dashboard-text hover:bg-dashboard-card-hover"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            View Results
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onExamClick();
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
