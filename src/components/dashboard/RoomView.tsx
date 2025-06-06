
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, FileText, Grid, List } from 'lucide-react';
import { RoomContentTable } from './RoomContentTable';
import { ContentItem } from '@/lib/types';
import type { ContentTag, ContentType } from './RoomContentTable';

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
  const exampleItems: ContentItem[] = [
    {
      id: '1',
      title: 'File Name Example',
      type: 'video',
      createdAt: '2025-05-30T00:00:00.000Z',
      metadata: {
        contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards']
      }
    },
    {
      id: '2',
      title: 'File Name Example',
      type: 'pdf',
      createdAt: '2025-05-30T00:00:00.000Z',
      metadata: {
        contentTags: ['Summary', 'Flashcards', 'Exams']
      }
    },
    {
      id: '3',
      title: 'File Name Example',
      type: 'recording',
      createdAt: '2025-05-30T00:00:00.000Z',
      metadata: {
        contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards']
      }
    },
    {
      id: '4',
      title: 'File Name Example',
      type: 'youtube',
      createdAt: '2025-05-30T00:00:00.000Z',
      metadata: {
        contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards']
      }
    }
  ];

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
                <Button variant="outline" className="component-base hover:bg-accent hover:text-primary hover:border-primary">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Room Chat
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-foreground mb-1">No documents yet</h2>
              <p className="text-muted-foreground max-w-md">
                Start adding documents, links, or create content directly to begin building your learning room.
              </p>
            </div>
          ) : (
            <RoomContentTable 
              items={exampleItems} 
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
