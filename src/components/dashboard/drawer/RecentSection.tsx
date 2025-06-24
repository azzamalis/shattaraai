
import React from 'react';
import { useContent } from '@/contexts/ContentContext';
import { RecentItem } from './recent/RecentItem';

interface RecentSectionProps {
  onShareClick?: (contentId: string, contentTitle: string) => void;
  onDeleteClick?: (contentId: string, contentTitle: string) => void;
}

export const RecentSection: React.FC<RecentSectionProps> = ({ 
  onShareClick, 
  onDeleteClick 
}) => {
  const { recentContent } = useContent();

  if (!recentContent || recentContent.length === 0) {
    return (
      <div className="text-xs text-muted-foreground text-center py-4">
        No recent content
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {recentContent.slice(0, 5).map((content) => (
        <RecentItem
          key={content.id}
          content={content}
          onShareClick={onShareClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};
