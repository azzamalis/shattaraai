
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, Calendar, Globe, Lock } from 'lucide-react';
import { ActionCards } from './ActionCards';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RoomContentProps {
  isEmpty?: boolean;
  onPasteClick: () => void;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'text' | 'website';
  addedOn: string;
  visibility: 'private' | 'public';
}

export function RoomContent({ isEmpty = true, onPasteClick }: RoomContentProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Mock content data for demonstration
  const mockContent: ContentItem[] = [
    {
      id: '1',
      title: 'Physics Lecture Notes.pdf',
      type: 'pdf',
      addedOn: '2024-01-15',
      visibility: 'private'
    },
    {
      id: '2',
      title: 'Quantum Mechanics Video',
      type: 'video',
      addedOn: '2024-01-14',
      visibility: 'public'
    },
    {
      id: '3',
      title: 'Study Group Recording',
      type: 'audio',
      addedOn: '2024-01-13',
      visibility: 'private'
    }
  ];

  const contentItems = isEmpty ? [] : mockContent;

  return (
    <div className="flex-1 bg-dashboard-bg">
      <div className="px-6 py-6">
        {/* Content header with item count and view toggles */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-dashboard-text-secondary">
            {contentItems.length} {contentItems.length === 1 ? 'Item' : 'Items'}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-dashboard-card text-dashboard-text' : 'text-dashboard-text-secondary'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${viewMode === 'list' ? 'bg-dashboard-card text-dashboard-text' : 'text-dashboard-text-secondary'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEmpty ? (
          /* Empty state with action cards */
          <div className="space-y-8">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-dashboard-text mb-2">
                What do you want to learn today?
              </h2>
              <p className="text-dashboard-text-secondary mb-8">
                Start by adding content to your learning space
              </p>
              
              <ActionCards onPasteClick={onPasteClick} />
            </div>

            {/* Empty table structure */}
            <div className="border border-dashboard-separator rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-dashboard-separator">
                    <TableHead className="text-dashboard-text font-medium">Title</TableHead>
                    <TableHead className="text-dashboard-text font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Added On
                      </div>
                    </TableHead>
                    <TableHead className="text-dashboard-text font-medium">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Visibility
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-dashboard-text-secondary">
                      No content added yet. Use the cards above to get started.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          /* Populated state with content table */
          <div className="border border-dashboard-separator rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-dashboard-separator">
                  <TableHead className="text-dashboard-text font-medium">Title</TableHead>
                  <TableHead className="text-dashboard-text font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Added On
                    </div>
                  </TableHead>
                  <TableHead className="text-dashboard-text font-medium">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Visibility
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.map((item) => (
                  <TableRow key={item.id} className="border-dashboard-separator hover:bg-dashboard-card-hover">
                    <TableCell className="text-dashboard-text font-medium">
                      {item.title}
                    </TableCell>
                    <TableCell className="text-dashboard-text-secondary">
                      {new Date(item.addedOn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.visibility === 'private' ? (
                          <Lock className="h-4 w-4 text-dashboard-text-secondary" />
                        ) : (
                          <Globe className="h-4 w-4 text-dashboard-text-secondary" />
                        )}
                        <span className="text-dashboard-text-secondary capitalize">
                          {item.visibility}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
