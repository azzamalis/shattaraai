import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentItem, ContentHandlers } from '@/lib/types';

interface ContentContextType extends ContentHandlers {
  content: ContentItem[];
  recentContent: ContentItem[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Dummy data for testing
const dummyContent: ContentItem[] = [
  {
    id: 'content-1',
    title: 'Introduction to Quantum Physics',
    type: 'pdf',
    createdAt: new Date().toISOString(),
    filename: 'quantum-physics.pdf',
    thumbnail: '/placeholder.svg',
    metadata: {
      pages: 25,
      progress: 0.4
    }
  },
  {
    id: 'content-2',
    title: 'Machine Learning Fundamentals',
    type: 'video',
    createdAt: new Date().toISOString(),
    duration: 3600,
    thumbnail: '/placeholder.svg',
    metadata: {
      duration: '1 hour',
      progress: 0.6
    }
  },
  {
    id: 'content-3',
    title: 'Web Development Best Practices',
    type: 'website',
    createdAt: new Date().toISOString(),
    url: 'https://example.com/web-dev',
    text: 'Learn about modern web development practices...',
    metadata: {
      readTime: '15 mins',
      progress: 0.2
    }
  },
  {
    id: 'content-4',
    title: 'Data Structures & Algorithms',
    type: 'recording',
    createdAt: new Date().toISOString(),
    duration: 1800,
    metadata: {
      duration: '30 mins',
      progress: 0.8
    }
  },
  {
    id: 'content-5',
    title: 'Advanced JavaScript Concepts',
    type: 'youtube',
    createdAt: new Date().toISOString(),
    url: 'https://youtube.com/watch?v=example',
    duration: 2700,
    thumbnail: '/placeholder.svg',
    metadata: {
      duration: '45 mins',
      progress: 0.3
    }
  }
];

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>(dummyContent);

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
