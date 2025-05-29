import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, FileText, Grid, List } from 'lucide-react';
import { RoomContentTable } from './RoomContentTable';
import type { ContentTag, ContentType } from './RoomContentTable';  // Import the types

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
  // Example data with proper typing - removed 'as const' and explicitly typed the arrays
  const exampleItems = [
    {
      id: '1',
      title: 'File Name Example',
      uploadedDate: '30/05/2025',
      contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards'] as ContentTag[],
      type: 'Video' as ContentType
    },
    {
      id: '2',
      title: 'File Name Example',
      uploadedDate: '30/05/2025',
      contentTags: ['Summary', 'Flashcards', 'Exams'] as ContentTag[],
      type: 'PDF Files' as ContentType
    },
    {
      id: '3',
      title: 'File Name Example',
      uploadedDate: '30/05/2025',
      contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards'] as ContentTag[],
      type: 'Recording' as ContentType
    },
    {
      id: '4',
      title: 'File Name Example',
      uploadedDate: '30/05/2025',
      contentTags: ['Summary', 'Notes', 'Exams', 'Flashcards'] as ContentTag[],
      type: 'Youtube URL' as ContentType
    }
  ];

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
                {isEmpty ? 'No documents' : `${exampleItems.length} documents`}
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

      <main className="flex-1 overflow-auto px-4">
        <div className="max-w-6xl mx-auto w-full py-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-dashboard-text mb-1">No documents yet</h2>
              <p className="text-dashboard-text-secondary max-w-md">
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
