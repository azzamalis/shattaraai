import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, FileText, Grid, List } from 'lucide-react';

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
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-dashboard-bg">
      {!hideHeader && (
        <header className="flex flex-col border-b border-dashboard-separator bg-dashboard-bg px-4 py-6 sticky top-0 z-10">
          <div className="mx-auto max-w-6xl w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-dashboard-text">{title}</h1>
                <p className="text-dashboard-text-secondary mt-1">{description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="border-dashboard-separator bg-dashboard-card text-dashboard-text hover:bg-dashboard-card-hover hover:text-primary hover:border-primary">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Room Chat
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Exam
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-dashboard-text-secondary">
                No documents
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-dashboard-text">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-dashboard-text-secondary">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

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
