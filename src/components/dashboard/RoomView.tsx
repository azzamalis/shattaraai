
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText } from 'lucide-react';
import { RoomContentView } from './RoomContentView';
import { ContentItem } from '@/lib/types';
import { useContent } from '@/hooks/useContent';
import { useParams } from 'react-router-dom';

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
  const { id: roomId } = useParams<{ id: string }>();
  const { content } = useContent();
  
  // Filter content for the current room if we have a roomId
  const roomContent = roomId ? content.filter(item => item.room_id === roomId) : content;
  
  // Use the actual content to determine if empty, fallback to prop
  const isActuallyEmpty = roomContent.length === 0;

  return (
    <div className="flex flex-col bg-background">
      {!hideHeader && (
        <header className="flex flex-col border-b border-border bg-background px-4 py-6 sticky top-0 z-10">
          <div className="mx-auto max-w-7xl w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="component-base hover:bg-accent hover:text-primary hover:border-primary w-[140px] h-10">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Room Chat
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-[140px] h-10">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Exam
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main>
        <div className="max-w-7xl mx-auto w-full py-6 pb-8">
          {isActuallyEmpty ? (
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-foreground mb-1">No documents yet</h2>
              <p className="text-muted-foreground max-w-md">
                Start adding documents, links, or create content directly to begin building your learning room.
              </p>
            </div>
          ) : (
            <RoomContentView 
              items={roomContent} 
              onEdit={(id) => console.log('Edit', id)}
              onDelete={(id) => console.log('Delete', id)}
              onShare={(id) => console.log('Share', id)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
