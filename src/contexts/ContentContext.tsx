
import React, { createContext, useContext, ReactNode } from 'react';
import { useContent as useContentHook } from '@/hooks/useContent';
import { ContentItem } from '@/hooks/useContent';

interface ContentContextType {
  content: ContentItem[];
  loading: boolean;
  addContent: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  addContentWithFile: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>, file?: File) => Promise<string | null>;
  addContentWithMetadata: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>, metadata?: any) => Promise<string | null>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  refreshContent: (roomId?: string) => Promise<void>;
  recentContent: ContentItem[];
  fetchContentById: (contentId: string) => Promise<ContentItem | null>;
  onAddContent: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  onAddContentWithMetadata: (content: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>, metadata?: any) => Promise<string | null>;
  onUpdateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  onDeleteContent: (id: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const contentHook = useContentHook();

  const contextValue: ContentContextType = {
    ...contentHook,
    onAddContent: contentHook.addContent,
    onAddContentWithMetadata: contentHook.addContentWithMetadata,
    onUpdateContent: contentHook.updateContent,
    onDeleteContent: contentHook.deleteContent,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
}

// Keep the useContent export for backward compatibility, but rename it to avoid conflicts
export const useContent = useContentContext;
