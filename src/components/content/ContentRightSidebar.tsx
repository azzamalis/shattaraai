
import React from 'react';
import RightSidebar from '@/components/recording/RightSidebar';
import { ContentData } from '@/pages/ContentPage';

interface ContentRightSidebarProps {
  contentData: ContentData;
}

export function ContentRightSidebar({ contentData }: ContentRightSidebarProps) {
  // For now, we'll use the existing RightSidebar component
  // In the future, we could pass contentData to provide context-aware AI interactions
  return <RightSidebar />;
}
