import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
import { ContentData } from '@/pages/ContentPage';
import { supabase } from '@/integrations/supabase/client';
interface DocumentContentProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
}
export function DocumentContent({
  contentData,
  onUpdateContent
}: DocumentContentProps) {
  const {
    zoom,
    searchTerm,
    setTotalPages
  } = useDocumentViewer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedText, setProcessedText] = useState<string | null>(null);
  useEffect(() => {
    setTotalPages(1); // Word documents are shown as single scrollable content
    setProcessedText(contentData.text || null);
  }, [setTotalPages, contentData.text]);

  // Auto-trigger text extraction for Word documents without text content
  useEffect(() => {
    const isWordDocument = contentData.filename?.toLowerCase().endsWith('.docx') || contentData.filename?.toLowerCase().endsWith('.doc');
    if (isWordDocument && !contentData.text && !isProcessing && contentData.url) {
      extractWordText();
    }
  }, [contentData]);
  const extractWordText = async () => {
    if (!contentData.url || !contentData.id) return;
    setIsProcessing(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('extract-word-text', {
        body: {
          contentId: contentData.id,
          storageUrl: contentData.url
        }
      });
      if (error) throw error;

      // Refetch the updated content
      const {
        data: updatedContent,
        error: fetchError
      } = await supabase.from('content').select('*').eq('id', contentData.id).single();
      if (fetchError) throw fetchError;
      if (updatedContent?.text_content) {
        setProcessedText(updatedContent.text_content);
        onUpdateContent({
          text: updatedContent.text_content
        });
      }
    } catch (error) {
      console.error('Error extracting Word text:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (contentData.url) {
      window.open(contentData.url, '_blank');
    }
  };
  const highlightSearchTerm = (text: string) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900">$1</mark>');
  };
  const isWordDocument = contentData.filename?.toLowerCase().endsWith('.docx') || contentData.filename?.toLowerCase().endsWith('.doc');
  return <div className="flex-1 bg-background">
      <ScrollArea className="h-full">
        <div className="p-6" style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left'
      }}>
          {isWordDocument ? <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow-sm">
              <div className="p-8 space-y-6 py-[16px] px-[16px]">
                
                
                {isProcessing ? <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Processing document...</p>
                    <p className="text-xs text-muted-foreground mt-1">Extracting text content</p>
                  </div> : processedText ? <div className="prose prose-sm max-w-none text-foreground">
                    <div dangerouslySetInnerHTML={{
                __html: highlightSearchTerm(processedText)
              }} className="whitespace-pre-wrap leading-relaxed text-sm mx-0 px-px" />
                  </div> : <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Document content is not yet available for preview.
                    </p>
                    <Button onClick={extractWordText} variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Extract Text Content
                    </Button>
                  </div>}
                
                
              </div>
            </div> : <div className="text-center py-12">
              <p className="text-muted-foreground">
                Document format not supported for preview.
              </p>
            </div>}
        </div>
      </ScrollArea>
    </div>;
}