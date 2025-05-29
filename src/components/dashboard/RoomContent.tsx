
import React from 'react';
import { Calendar, Globe, Lock } from 'lucide-react';
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
  // Mock content data for demonstration
  const mockContent: ContentItem[] = [
    {
      id: '1',
      title: 'Black Holes Explained - From Birth to Death',
      type: 'video',
      addedOn: '2025-03-15',
      visibility: 'public'
    },
    {
      id: '2',
      title: 'The British Empire',
      type: 'text',
      addedOn: '2025-05-12',
      visibility: 'public'
    },
    {
      id: '3',
      title: 'How To Find The Range of a Function',
      type: 'video',
      addedOn: '2025-03-20',
      visibility: 'public'
    }
  ];

  const contentItems = isEmpty ? [] : mockContent;

  return (
    <div className="flex-1 bg-dashboard-bg">
      <div className="px-6 py-6">
        {/* Content header with item count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-dashboard-text-secondary">
            {contentItems.length} {contentItems.length === 1 ? 'Item' : 'Items'}
          </div>
        </div>

        {/* Content table */}
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
              {contentItems.length > 0 ? (
                contentItems.map((item) => (
                  <TableRow key={item.id} className="border-dashboard-separator hover:bg-dashboard-card-hover">
                    <TableCell className="text-dashboard-text font-medium">
                      <div className="flex items-center gap-3">
                        {item.type === 'video' && (
                          <div className="w-2 h-2 bg-dashboard-text rounded-full"></div>
                        )}
                        {item.type === 'text' && (
                          <div className="w-6 h-4 bg-dashboard-text/20 rounded flex items-center justify-center">
                            <div className="w-4 h-2 bg-dashboard-text/40 rounded-sm"></div>
                          </div>
                        )}
                        {item.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-dashboard-text-secondary">
                      {new Date(item.addedOn).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric', 
                        year: 'numeric'
                      })}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12 text-dashboard-text-secondary">
                    No content added yet. Use the options above to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
