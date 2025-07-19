import React, { useEffect, useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
import { ContentData } from '@/pages/ContentPage';
import mammoth from 'mammoth';
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
    documentHtml,
    setTotalPages,
    setDocumentHtml
  } = useDocumentViewer();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const isWordDocument = contentData.filename?.toLowerCase().endsWith('.docx') || contentData.filename?.toLowerCase().endsWith('.doc');
    if (isWordDocument && contentData.url && !documentHtml && !isProcessing) {
      processWordDocument();
    }
  }, [contentData, documentHtml, isProcessing]);

  // Update total pages based on processed content
  useEffect(() => {
    if (documentHtml) {
      // For now, set as single page - you could implement pagination logic here
      setTotalPages(1);
    }
  }, [documentHtml, setTotalPages]);
  const processWordDocument = async () => {
    if (!contentData.url) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Fetch the Word document
      const response = await fetch(contentData.url);
      if (!response.ok) throw new Error('Failed to fetch document');
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Convert to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (result.messages.length > 0) {
        console.warn('Mammoth conversion warnings:', result.messages);
      }
      
      // Set the HTML content
      setDocumentHtml(result.value);
      
      // Also update the text content for backwards compatibility
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = result.value;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      onUpdateContent({
        text: textContent
      });
      
    } catch (error) {
      console.error('Error processing Word document:', error);
      setError(error instanceof Error ? error.message : 'Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (contentData.url) {
      window.open(contentData.url, '_blank');
    }
  };
  const getHighlightedContent = () => {
    if (!documentHtml) return '';
    if (!searchTerm.trim()) return documentHtml;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return documentHtml.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-700 dark:text-yellow-100">$1</mark>');
  };
  const isWordDocument = contentData.filename?.toLowerCase().endsWith('.docx') || contentData.filename?.toLowerCase().endsWith('.doc');
  
  return (
    <div className="flex-1 bg-background overflow-hidden">
      <ScrollArea className="h-full w-full">
        <div 
          className="min-h-full w-full flex justify-center p-6"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {isWordDocument ? (
            <div className="bg-card border border-border shadow-lg min-h-[11in] w-full max-w-[8.5in] mx-auto">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
                  <p className="text-lg text-muted-foreground">Processing document...</p>
                  <p className="text-sm text-muted-foreground mt-2">Converting to visual format</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <AlertCircle className="h-12 w-12 text-destructive mb-6" />
                  <p className="text-lg text-foreground mb-2">Failed to process document</p>
                  <p className="text-sm text-muted-foreground mb-6">{error}</p>
                  <Button onClick={processWordDocument} variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              ) : documentHtml ? (
                <div 
                  ref={documentRef}
                  className="p-16 prose prose-sm max-w-none text-foreground leading-relaxed w-full"
                  dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
                  style={{
                    fontSize: '12pt',
                    lineHeight: '1.6',
                    color: 'inherit',
                    fontFamily: '"Times New Roman", Times, serif'
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-24">
                  <FileText className="h-12 w-12 text-muted-foreground mb-6" />
                  <p className="text-lg text-muted-foreground mb-2">
                    Document content is not yet available for preview.
                  </p>
                  <Button onClick={processWordDocument} variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Process Document
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-6 mx-auto" />
              <p className="text-lg text-muted-foreground">
                Document format not supported for visual preview.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Only Word documents (.docx, .doc) are supported.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}