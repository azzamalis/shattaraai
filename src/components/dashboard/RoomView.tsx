
import React from 'react';
import { FileText } from 'lucide-react';

interface RoomViewProps {
  title: string;
  description: string;
  isEmpty?: boolean;
  hideHeader?: boolean;
}

export function RoomView({
  title,
  description,
  isEmpty = true,
  hideHeader = false
}: RoomViewProps) {
  // This component is now simplified and mainly used for backward compatibility
  // The main room functionality is now in RoomContent and RoomHeader components
  
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-dashboard-bg">
      <main className="flex-1 overflow-auto">
        <div className="flex flex-col items-center justify-center h-full text-center bg-dashboard-bg">
          <FileText className="h-12 w-12 text-dashboard-text/40 mb-4" />
          <h2 className="text-xl font-bold text-dashboard-text mb-2">No documents yet</h2>
          <p className="text-dashboard-text-secondary max-w-md">
            Start adding documents, links, or create content directly to begin building your learning room.
          </p>
        </div>
      </main>
    </div>
  );
}
