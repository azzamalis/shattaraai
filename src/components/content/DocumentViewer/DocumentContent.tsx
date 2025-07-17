import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
import { ContentData } from '@/pages/ContentPage';
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
    currentPage,
    setTotalPages
  } = useDocumentViewer();
  useEffect(() => {
    // Simulate setting total pages based on content
    setTotalPages(3);
  }, [setTotalPages]);
  const isWordDocument = contentData.filename?.match(/\.(doc|docx)$/i);
  return <div className="flex-1 flex flex-col bg-muted/30">
      <ScrollArea className="flex-1">
        <div className="flex justify-center p-4 px-0 py-0">
          <div className="bg-white shadow-lg border border-border max-w-4xl" style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          width: '210mm',
          // A4 width
          minHeight: '297mm' // A4 height
        }}>
            {isWordDocument ? <div className="p-8 text-gray-900">
                <div className="mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <FileText className="h-16 w-16 text-blue-600 mb-4" />
                  </div>
                  <h1 className="text-2xl font-bold text-center mb-4">
                    {contentData.title || contentData.filename}
                  </h1>
                  <div className="text-center text-gray-600 mb-8">
                    <p>Microsoft Word Document</p>
                    <p className="text-sm mt-2">
                      File: {contentData.filename}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Document Preview</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      This is a preview of your Word document. The actual content would be rendered here
                      when the document is processed and converted for viewing.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-800">Document Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">File Type:</span>
                          <span className="ml-2 text-gray-800">
                            {contentData.filename?.split('.').pop()?.toUpperCase()} Document
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Status:</span>
                          <span className="ml-2 text-green-600">Ready for viewing</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Pages:</span>
                          <span className="ml-2 text-gray-800">3 pages</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Size:</span>
                          <span className="ml-2 text-gray-800">Optimized</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {contentData.text && <div>
                      <h3 className="text-lg font-medium mb-2 text-gray-800">Extracted Content</h3>
                      <div className="border border-gray-200 p-4 rounded-lg bg-inherit">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {contentData.text}
                        </p>
                      </div>
                    </div>}

                  <div className="text-center pt-8">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Original Document
                    </Button>
                  </div>
                </div>
              </div> : <div className="p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Document Viewer</h2>
                <p className="text-gray-600">
                  {contentData.filename || 'Document content will appear here'}
                </p>
              </div>}
          </div>
        </div>
      </ScrollArea>
    </div>;
}