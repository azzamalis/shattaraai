import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesProps {
  isRecording: boolean;
}

const Notes = ({ isRecording }: NotesProps): JSX.Element => {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/60 space-y-4 p-4">
        <div className="h-12 w-12 mb-2">📝</div>
        <p className="text-center max-w-md text-base">
          {isRecording 
            ? "Taking notes during your recording..."
            : "Your notes will appear here during recording."}
        </p>
      </div>
    </ScrollArea>
  );
};

export default Notes;
