import React, { useState, useRef } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
interface NewPDFViewerProps {
  contentData?: {
    url?: string;
    type?: string;
  };
  onFileUploaded?: (url: string) => void;
}
export function NewPDFViewer({
  contentData,
  onFileUploaded
}: NewPDFViewerProps) {
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>(contentData?.url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();

  // Initialize the default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }
    setUploading(true);
    try {
      // Get current user
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create unique filename
      const fileName = `${user.id}/${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const {
        data,
        error
      } = await supabase.storage.from('user-uploads').upload(fileName, file);
      if (error) throw error;

      // Get public URL
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('user-uploads').getPublicUrl(data.path);
      setPdfUrl(publicUrl);
      onFileUploaded?.(publicUrl);
      toast({
        title: "Upload successful",
        description: "Your PDF has been uploaded and is ready to view"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Loading skeleton
  if (uploading) {
    return <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm text-muted-foreground">Uploading PDF...</span>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>;
  }

  // Upload interface when no PDF
  if (!pdfUrl) {
    return <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload PDF Document</h3>
              <p className="text-sm text-muted-foreground">
                Select a PDF file to view and interact with
              </p>
            </div>
            <Button onClick={triggerFileUpload} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Choose PDF File
            </Button>
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
          </div>
        </CardContent>
      </Card>;
  }

  // PDF Viewer
  return <div className="w-full h-full">
      

      <Card className="w-full shadow-lg">
        <CardContent className="p-2 w-full overflow-hidden rounded-md border" style={{
          height: '90vh'
        }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} theme="light" />
          </Worker>
        </CardContent>
      </Card>
    </div>;
}