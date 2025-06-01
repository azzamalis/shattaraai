import React from 'react';
import { NotesEditor } from '@/components/chat/NotesEditor/NotesEditor';

interface NotesProps {
  isRecording: boolean;
}

const Notes = ({ isRecording }: NotesProps): JSX.Element => {
  return (
    <div className="h-full bg-[#0F0F0F]">
      <NotesEditor useDynamicMenuPosition={true} />
    </div>
  );
};

export default Notes;
