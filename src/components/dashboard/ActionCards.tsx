import React, { useRef } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Upload, FileText, Mic, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContentContext } from '@/contexts/ContentContext';

interface ActionCardsProps {
  onPasteClick: () => void;
}

export function ActionCards({ onPasteClick }: ActionCardsProps) {
  const navigate = useNavigate();
  const { addContent, addContentWithFile } = useContentContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Determine content type based on file
        let contentType = 'upload';
        if (file.type.includes('pdf')) contentType = 'pdf';
        else if (file.type.includes('audio')) contentType = 'audio_file';
        else if (file.type.includes('video')) contentType = 'video';

        // Show loading toast
        const loadingToast = toast.loading(`Uploading ${file.name}...`);

        // Use addContentWithFile for PDFs to upload to Supabase Storage
        const contentId = contentType === 'pdf' 
          ? await addContentWithFile({
              title: file.name,
              type: contentType as any,
              room_id: null,
              metadata: {
                fileSize: file.size,
                fileType: file.type,
                isUploadedFile: true
              },
              filename: file.name
            }, file)
          : await addContent({
              title: file.name,
              type: contentType as any,
              room_id: null,
              metadata: {
                fileSize: file.size,
                fileType: file.type,
                isUploadedFile: true
              },
              filename: file.name,
              url: URL.createObjectURL(file) // Only use blob URLs for non-PDF files
            });

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (contentId) {
          // Navigate to content page - Fix: use the returned contentId directly
          navigate(`/content/${contentId}`);
          toast.success(`File "${file.name}" uploaded successfully`);
        } else {
          throw new Error('Failed to create content');
        }
      } catch (error) {
        console.error('Error handling file upload:', error);
        toast.error('Failed to upload the file. Please try again.');
      }
    }
  };

  const handleRecordClick = async () => {
    try {
      // Add live recording to tracking system
      const contentId = await addContent({
        title: `Live Recording at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        type: 'live_recording',
        room_id: null,
        metadata: {
          isLiveRecording: true,
          recordingStatus: 'ready'
        }
      });

      if (contentId) {
        navigate(`/content/${contentId}?type=live_recording`);
        toast.success('Recording session created');
      } else {
        throw new Error('Failed to create recording session');
      }
    } catch (error) {
      console.error('Error creating recording session:', error);
      toast.error('Failed to create recording session. Please try again.');
    }
  };

  return (
    <>
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,audio/*,video/*" 
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
      />
      
      <div className="sm:justify-center sm:items-center gap-3 sm:flex grid grid-cols-1 w-full">
        {/* Upload Card */}
        <div className="flex-1 w-full sm:w-1/3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="border-border text-card-foreground shadow-sm rounded-2xl group bg-card cursor-pointer transition-all duration-200 relative hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  onClick={handleUploadClick}
                >
                  <div className="p-4 sm:h-[120px] flex flex-col sm:flex-col items-start justify-center gap-y-1">
                    <div className="flex items-center gap-x-3 sm:block">
                      <Upload className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors sm:mb-2 flex-shrink-0" />
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-x-1">
                          <h3 className="font-normal text-sm sm:text-base text-left text-primary/80 group-hover:text-primary">Upload</h3>
                        </div>
                        <p className="text-xs sm:text-sm group-hover:text-primary/80 text-left text-primary/60">File, Audio, Video</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border text-popover-foreground px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
                <p className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Supported file types: PDF, PPT, DOC, TXT, Audio, Video
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Paste Card */}
        <div className="flex-1 w-full sm:w-1/3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="border-border text-card-foreground shadow-sm rounded-2xl group bg-card cursor-pointer transition-all duration-200 relative hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  onClick={onPasteClick}
                >
                  <div className="p-4 sm:h-[120px] flex flex-col sm:flex-col items-start justify-center gap-y-1">
                    <div className="flex items-center gap-x-3 sm:block">
                      <Link2 className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors sm:mb-2 flex-shrink-0" />
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-x-1">
                          <h3 className="font-normal text-sm sm:text-base text-left text-primary/80 group-hover:text-primary">Paste</h3>
                        </div>
                        <p className="text-xs sm:text-sm group-hover:text-primary/80 text-left text-primary/60">YouTube, Website, Text</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border text-popover-foreground px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
                <p className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  YouTube Link, Website URL, Text content
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Record Card */}
        <div className="flex-1 w-full sm:w-1/3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="border-border text-card-foreground shadow-sm rounded-2xl group bg-card cursor-pointer transition-all duration-200 relative hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  onClick={handleRecordClick}
                >
                  <div className="p-4 sm:h-[120px] flex flex-col sm:flex-col items-start justify-center gap-y-1">
                    <div className="flex items-center gap-x-3 sm:block">
                      <Mic className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors sm:mb-2 flex-shrink-0" />
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-x-1">
                          <h3 className="font-normal text-sm sm:text-base text-left text-primary/80 group-hover:text-primary">Record</h3>
                        </div>
                        <p className="text-xs sm:text-sm group-hover:text-primary/80 text-left text-primary/60">Record Your Lecture</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border text-popover-foreground px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
                <p className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  Record audio directly in your browser
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
