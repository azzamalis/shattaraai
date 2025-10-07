import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { UnifiedTabType } from '@/components/shared/UnifiedTabNavigation';
import { useContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const { fetchContentById } = useContent();
  
  const [contentData, setContentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<UnifiedTabType>('chat');
  const [initialFiles, setInitialFiles] = useState<any[] | undefined>(undefined);

  // Load content from database
  useEffect(() => {
    const loadContent = async () => {
      if (!contentId) {
        setLoading(false);
        return;
      }

      try {
        const content = await fetchContentById(contentId);
        if (content) {
          setContentData(content);
          
          // Extract initial files from metadata if present
          if (content.metadata?.attachments && Array.isArray(content.metadata.attachments)) {
            setInitialFiles(content.metadata.attachments);
          }
        }
      } catch (error) {
        console.error('Failed to load chat content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentId, fetchContentById]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading chat...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      className="chat-page-layout p-0"
      contentData={contentData}
      onUpdateContent={(updates) => setContentData(prev => ({ ...prev, ...updates }))}
    >
      <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
        <ChatInterface 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          initialQuery={query || contentData?.text_content}
          contentId={contentId}
          roomId={contentData?.room_id}
          initialFiles={initialFiles}
        />
      </div>
    </DashboardLayout>
  );
}
