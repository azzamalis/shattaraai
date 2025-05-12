
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  title: string;
  description: string;
  pdfPlaceholder: boolean;
}

const PDFViewer = ({ title, description, pdfPlaceholder }: PDFViewerProps) => {
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
        <iframe 
          src="/path-to-pdf-file.pdf" 
          className="w-full h-[700px] border-0 rounded-lg"
          title={title}
        />
      )}
    </div>
  );
};

export default PDFViewer;
