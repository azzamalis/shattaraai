
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface PDFViewerProps {
  title: string;
  description: string;
  pdfPlaceholder: boolean;
  pdfPath?: string;
}

const PDFViewer = ({ title, description, pdfPlaceholder, pdfPath }: PDFViewerProps) => {
  return (
    <div className="min-h-[500px] bg-dark-deeper p-8 rounded-xl border border-primary/20">
      {pdfPlaceholder ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="size-24 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
            <FileText className="text-primary size-12" />
          </div>
          <h3 className="text-2xl font-semibold text-center mb-4">{title} PDF Coming Soon</h3>
          <p className="text-gray-400 text-center max-w-md mb-6">
            {description}
          </p>
          <Button className="bg-primary hover:bg-primary/90" disabled>
            Download PDF
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <iframe 
            src={pdfPath} 
            className="w-full h-[700px] border-0 rounded-lg mb-4"
            title={title}
          />
          <div className="flex justify-center mt-2">
            <a 
              href={pdfPath} 
              download 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-primary hover:bg-primary/90">
                <Download className="mr-2 size-4" />
                Download PDF
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
