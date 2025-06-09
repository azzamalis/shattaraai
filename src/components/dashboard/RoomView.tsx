import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText } from 'lucide-react';
import { RoomContentView } from './RoomContentView';
import { ContentItem } from '@/lib/types';

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
      title: 'Introduction to React Hooks',
      type: 'video',
      createdAt: '2025-05-30T00:00:00.000Z',
      filename: 'react-hooks-intro.mp4',
      metadata: {
        contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards'],
        progress: 0.75
      }
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      type: 'pdf',
      createdAt: '2025-05-29T00:00:00.000Z',
      filename: 'typescript-patterns.pdf',
      metadata: {
        contentTags: ['Summary', 'Flashcards', 'Exams'],
        progress: 0.5
      }
    },
    {
      id: '3',
      title: 'System Design Interview Prep',
      type: 'recording',
      createdAt: '2025-05-28T00:00:00.000Z',
      filename: 'system-design.mp3',
      metadata: {
        contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards'],
        progress: 0.25
      }
    },
    {
      id: '4',
      title: 'Building Modern UIs with TailwindCSS',
      type: 'youtube',
      createdAt: '2025-05-27T00:00:00.000Z',
      filename: 'tailwind-ui-tutorial',
      metadata: {
        contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards'],
        progress: 0.9
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
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-foreground mb-1">No documents yet</h2>
              <p className="text-muted-foreground max-w-md">
                Start adding documents, links, or create content directly to begin building your learning room.
              </p>
            </div>
          ) : (
            <RoomContentView 
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
