
import React, { createContext, useContext, ReactNode } from 'react';
import { useContent } from '@/hooks/useContent';
import { ContentItem } from '@/hooks/useContent';

interface ContentContextType {
  content: ContentItem[];
  loading: boolean;
  addContent: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  addContentWithFile: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>, file?: File) => Promise<string | null>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  refreshContent: (roomId?: string) => Promise<void>;
  recentContent: ContentItem[];
  onAddContent: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const contentHook = useContent();

  const contextValue: ContentContextType = {
    ...contentHook,
    onAddContent: contentHook.addContent,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
