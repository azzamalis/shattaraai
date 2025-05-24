
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentItem, ContentHandlers } from '@/lib/types';

interface ContentContextType extends ContentHandlers {
  content: ContentItem[];
  recentContent: ContentItem[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([]);

  // Load content from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userContent');
    if (stored) {
      try {
        const parsedContent = JSON.parse(stored);
        setContent(parsedContent);
      } catch (error) {
        console.error('Failed to parse stored content:', error);
      }
    }
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem('userContent', JSON.stringify(content));
  }, [content]);

  const onAddContent = (newContent: Omit<ContentItem, 'id' | 'createdAt'>) => {
    const contentItem: ContentItem = {
      ...newContent,
      id: `content-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setContent(prev => [contentItem, ...prev]);
    return contentItem.id;
  };

  const onDeleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };

  // Get recent content (last 10 items)
  const recentContent = content.slice(0, 10);

  return (
    <ContentContext.Provider value={{
      content,
      recentContent,
      onAddContent,
      onDeleteContent
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
