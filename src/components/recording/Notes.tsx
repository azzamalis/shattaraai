import React from 'react';
import { EnhancedNotesEditor } from '@/components/chat/NotesEditor/enhanced/EnhancedNotesEditor';

interface NotesProps {
  isRecording: boolean;
}

const Notes = ({ isRecording }: NotesProps): JSX.Element => {
  return (
    <div className="h-full bg-background">
      <EnhancedNotesEditor useDynamicMenuPosition={true} />
    </div>
  );
};

export default Notes;
