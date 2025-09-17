
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { UnifiedTabType } from '@/components/shared/UnifiedTabNavigation';
import { ContentType } from '@/lib/types';
import { useContent } from '@/hooks/useContent';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const { fetchContentById } = useContent();
  
  console.log('ChatPage - Received query:', query, 'Content ID:', id);
  
  // Determine if this is a new chat or existing chat
  const isNewChat = !id || id === 'new' || id === 'new-chat';
  const contentId = isNewChat ? undefined : id;
  
  const [contentData, setContentData] = useState({
    id: id || 'new-chat',
    type: 'chat' as ContentType,
    title: 'Chat with Shattara AI',
    text: query || '',
    isProcessing: false,
    hasError: false,
  });

  // Load existing chat content if contentId is provided
  useEffect(() => {
    const loadChatContent = async () => {
      if (contentId && contentId !== 'new' && contentId !== 'new-chat') {
        try {
          const existingContent = await fetchContentById(contentId);
          if (existingContent) {
            setContentData({
              id: existingContent.id,
              type: existingContent.type,
              title: existingContent.title,
              text: existingContent.text_content || '',
              isProcessing: existingContent.processing_status === 'processing',
              hasError: existingContent.processing_status === 'failed',
            });
          }
        } catch (error) {
          console.error('Failed to load chat content:', error);
        }
      }
    };

    loadChatContent();
  }, [contentId, fetchContentById]);

  const [activeTab, setActiveTab] = useState<UnifiedTabType>('chat');

  const updateContentData = (updates: any) => {
    setContentData(prev => ({ ...prev, ...updates }));
  };

  return (
    <DashboardLayout 
      className="chat-page-layout p-0"
      contentData={contentData}
      onUpdateContent={updateContentData}
    >
      <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
        <ChatInterface 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          initialQuery={query}
          contentId={contentId}
        />
      </div>
    </DashboardLayout>
  );
}
