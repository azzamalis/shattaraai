import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PDFDebugInfoProps {
  contentData: any;
  pdfUrl: string | null;
}

export function PDFDebugInfo({ contentData, pdfUrl }: PDFDebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-auto px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Info className="h-3 w-3 mr-1" />
          Debug Info
          {isOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="bg-muted/50 rounded-md p-3 text-xs space-y-2 border border-border">
          <div>
            <strong>Content ID:</strong> {contentData.id}
          </div>
          <div>
            <strong>Content Type:</strong> {contentData.type}
          </div>
          <div>
            <strong>URL:</strong> {contentData.url || 'null'}
          </div>
          <div>
            <strong>File Path:</strong> {contentData.filePath || 'null'}
          </div>
          <div>
            <strong>Filename:</strong> {contentData.filename || 'null'}
          </div>
          <div>
            <strong>Final PDF URL:</strong> {pdfUrl || 'null'}
          </div>
          <div>
            <strong>Is Storage URL:</strong> {pdfUrl?.includes('/storage/v1/object/public/') ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Blob URL:</strong> {pdfUrl?.startsWith('blob:') ? 'Yes' : 'No'}
          </div>
          {contentData.metadata && (
            <div>
              <strong>Metadata:</strong>
              <pre className="text-xs mt-1 overflow-auto max-h-32 bg-background rounded p-2">
                {JSON.stringify(contentData.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}