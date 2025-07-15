import React from 'react';
import NotionEditor from '@/components/content/NotionEditor';

interface NotesProps {
  isRecording: boolean;
}

const Notes = ({ isRecording }: NotesProps): JSX.Element => {
  return (
    <div className="h-full w-full p-0 m-0 overflow-hidden">
      <NotionEditor />
    </div>
  );
};

export default Notes;
