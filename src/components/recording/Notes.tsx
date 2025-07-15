import React from 'react';
import NotionEditor from '@/components/content/NotionEditor';

interface NotesProps {
  isRecording: boolean;
}

const Notes = ({ isRecording }: NotesProps): JSX.Element => {
  return (
    <div className="h-full bg-background">
      <NotionEditor />
    </div>
  );
};

export default Notes;
