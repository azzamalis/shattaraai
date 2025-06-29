
import React, { createContext, useContext, ReactNode } from 'react';
import { useContent, ContentItem } from '@/hooks/useContent';

interface ContentContextType {
  content: ContentItem[];
  loading: boolean;
  addContent: (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  addContentWithFile: (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>, file?: File) => Promise<string | null>;
  addContentWithMetadata: (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>, metadata?: any) => Promise<string | null>;
  updateContent: (contentId: string, updates: Partial<ContentItem>) => Promise<void>;
  onUpdateContent: (contentId: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (contentId: string) => Promise<void>;
  refreshContent: (roomId?: string) => Promise<void>;
  recentContent: ContentItem[];
  fetchContentById: (contentId: string) => Promise<ContentItem | null>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contentHook = useContent();

  const contextValue: ContentContextType = {
    ...contentHook,
    onUpdateContent: contentHook.updateContent, // Alias for compatibility
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
};
