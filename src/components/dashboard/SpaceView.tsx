
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, FileText, Grid, List, Plus } from 'lucide-react';

interface SpaceViewProps {
  title: string;
  description: string;
  isEmpty?: boolean;
}

export function SpaceView({ title, description, isEmpty = true }: SpaceViewProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col border-b border-gray-300 bg-dark-deeper p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-gray-300 bg-white text-gray-800 hover:bg-white hover:text-primary hover:border-primary">
              <MessageSquare className="mr-2 h-4 w-4" />
              Space Chat
            </Button>
            <Button className="bg-primary hover:bg-primary-light text-white">
              <FileText className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            {isEmpty ? 'No documents' : '5 documents'}
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-white">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-[#222222]">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-white p-8 rounded-full mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No documents yet</h2>
            <p className="text-gray-400 max-w-md mb-6">
              Start adding documents, links, or create content directly to begin building your learning space.
            </p>
            <Button className="bg-primary hover:bg-primary-light text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white border-gray-200 p-4 hover:border-primary transition-colors">
              <div className="flex items-start gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium text-gray-800">Introduction to Mechanics.pdf</h3>
                  <p className="text-sm text-gray-600 mt-1">Added 2 days ago • 24 pages</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
