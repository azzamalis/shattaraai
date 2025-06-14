import React, { createContext, useContext } from 'react';
import { useContent, ContentItem } from '@/hooks/useContent';

interface ContentContextType {
  content: ContentItem[];
  recentContent: ContentItem[];
  loading: boolean;
  onAddContent: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  onDeleteContent: (id: string) => Promise<void>;
  onUpdateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { 
    content, 
    loading, 
    addContent, 
    updateContent, 
    deleteContent, 
    recentContent 
  } = useContent();

  return (
    <ContentContext.Provider value={{
      content,
      recentContent,
      loading,
      onAddContent: addContent,
      onDeleteContent: deleteContent,
      onUpdateContent: updateContent
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
}

// Keep the old useContent export for backward compatibility
export { useContentContext as useContent };
