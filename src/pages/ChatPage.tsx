
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { UnifiedTabType } from '@/components/shared/UnifiedTabNavigation';
import { ContentType } from '@/lib/types';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  
  console.log('ChatPage - Received query:', query);
  
  const [contentData, setContentData] = useState({
    id: id || 'new-chat',
    type: 'chat' as ContentType,
    title: 'Chat with Shattara AI',
    text: query || '',
    isProcessing: false,
    hasError: false,
  });

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
        />
      </div>
    </DashboardLayout>
  );
}
