
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

  const handleShareClick = (contentId: string, contentTitle: string) => {
    console.log('RecentSection - Share clicked:', contentId, contentTitle);
    if (onShareClick) {
      onShareClick(contentId, contentTitle);
    }
  };

  const handleDeleteClick = (contentId: string, contentTitle: string) => {
    console.log('RecentSection - Delete clicked:', contentId, contentTitle);
    if (onDeleteClick) {
      onDeleteClick(contentId, contentTitle);
    }
  };

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
          onShareClick={handleShareClick}
          onDeleteClick={handleDeleteClick}
        />
      ))}
    </div>
  );
};
