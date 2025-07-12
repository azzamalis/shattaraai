
import React, { useRef } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Upload, FileText, Mic, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContentContext } from '@/contexts/ContentContext';

interface ActionCardsProps {
  onPasteClick: () => void;
}

export function ActionCards({
  onPasteClick
}: ActionCardsProps) {
  const navigate = useNavigate();
  const {
    addContent,
    addContentWithFile
  } = useContentContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    console.log('DEBUG: ActionCards - Upload button clicked');
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('DEBUG: ActionCards - File selected:', file ? {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    } : 'No file selected');

    if (file) {
      try {
        // Determine content type based on file type and extension
        let contentType = 'upload';
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        
        console.log('DEBUG: ActionCards - File type analysis:', {
          originalFileType: file.type,
          lowerCaseFileType: fileType,
          originalFileName: file.name,
          lowerCaseFileName: fileName
        });

        if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
          contentType = 'pdf';
        } else if (fileType.includes('audio') || ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'].some(ext => fileName.endsWith(ext))) {
          contentType = 'audio_file';
        } else if (fileType.includes('video') || ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].some(ext => fileName.endsWith(ext))) {
          contentType = 'video';
        } else if (['.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx'].some(ext => fileName.endsWith(ext))) {
          contentType = 'file';
        }

        console.log('DEBUG: ActionCards - Determined content type:', contentType);
        console.log('DEBUG: ActionCards - Starting file upload process with data:', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          determinedContentType: contentType,
          timestamp: new Date().toISOString()
        });

        // Show loading toast
        const loadingToast = toast.loading(`Uploading ${file.name}...`);
        console.log('DEBUG: ActionCards - Loading toast shown for file upload');

        // Use addContentWithFile for ALL file uploads to ensure proper storage handling
        console.log('DEBUG: ActionCards - Calling addContentWithFile with parameters:', {
          contentData: {
            title: file.name,
            type: contentType,
            room_id: null,
            metadata: {
              fileSize: file.size,
              fileType: file.type,
              isUploadedFile: true,
              uploadedAt: new Date().toISOString(),
              originalFileName: file.name
            },
            filename: file.name
          },
          fileSize: file.size
        });

        const contentId = await addContentWithFile({
          title: file.name,
          type: contentType as any,
          room_id: null,
          metadata: {
            fileSize: file.size,
            fileType: file.type,
            isUploadedFile: true,
            uploadedAt: new Date().toISOString(),
            originalFileName: file.name
          },
          filename: file.name
        }, file);

        // Dismiss loading toast
        toast.dismiss(loadingToast);
        console.log('DEBUG: ActionCards - Upload completed, content ID received:', contentId);
        
        if (contentId) {
          console.log('DEBUG: ActionCards - Content created successfully, preparing navigation');
          console.log('DEBUG: ActionCards - Navigation details:', {
            contentId,
            targetRoute: `/content/${contentId}`,
            timestamp: new Date().toISOString()
          });

          // Add a small delay to ensure database transaction is complete
          setTimeout(() => {
            console.log('DEBUG: ActionCards - Executing navigation to content page:', contentId);
            navigate(`/content/${contentId}`);
            toast.success(`File "${file.name}" uploaded successfully`);
            console.log('DEBUG: ActionCards - Navigation completed and success toast shown');
          }, 100);
        } else {
          console.error('DEBUG: ActionCards - Upload failed: No content ID returned');
          throw new Error('Failed to create content - no ID returned');
        }
      } catch (error) {
        console.error('DEBUG: ActionCards - Error during file upload process:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
          fileName: file.name,
          fileSize: file.size,
          timestamp: new Date().toISOString()
        });
        toast.error('Failed to upload the file. Please try again.');
      }
    } else {
      console.warn('DEBUG: ActionCards - No file was selected in handleFileSelect');
    }
  };

  const handleRecordClick = async () => {
    console.log('DEBUG: ActionCards - Record button clicked');
    try {
      // Add live recording to tracking system WITHOUT auto-assigning to any room
      const contentId = await addContent({
        title: `Live Recording at ${new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        type: 'live_recording',
        room_id: null,
        metadata: {
          isLiveRecording: true,
          recordingStatus: 'ready',
          createdAt: new Date().toISOString()
        }
      });

      console.log('DEBUG: ActionCards - Live recording content created:', contentId);

      if (contentId) {
        navigate(`/content/${contentId}?type=live_recording`);
        toast.success('Recording session created');
        console.log('DEBUG: ActionCards - Navigated to live recording page');
      } else {
        throw new Error('Failed to create recording session');
      }
    } catch (error) {
      console.error('DEBUG: ActionCards - Error creating recording session:', error);
      toast.error('Failed to create recording session. Please try again.');
    }
  };

  return <>
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.csv,.xls,.xlsx,audio/*,video/*,image/*" 
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
      />
      
      <div className="sm:justify-center sm:items-center gap-3 sm:flex grid grid-cols-1 w-full">
        {/* Upload Card */}
        <div className="flex-1 w-full sm:w-1/3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="border-border text-card-foreground shadow-sm rounded-2xl group bg-card cursor-pointer transition-all duration-200 relative hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]" onClick={handleUploadClick}>
                  <div className="p-4 sm:h-[120px] flex flex-col sm:flex-col items-start justify-center gap-y-1">
                    <div className="flex items-center gap-x-3 sm:block">
                      <Upload className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors sm:mb-2 flex-shrink-0" />
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-x-1">
                          <h3 className="text-sm text-left text-primary/80 group-hover:text-primary font-medium sm:text-base">Upload</h3>
                        </div>
                        <p className="text-xs group-hover:text-primary/80 text-left text-primary/60 font-medium sm:text-sm">File, Audio, Video, PDF</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border text-popover-foreground px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
                <p className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Supported: PDF, DOC, PPT, TXT, Audio, Video, Images
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
                <div className="border-border text-card-foreground shadow-sm rounded-2xl group bg-card cursor-pointer transition-all duration-200 relative hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]" onClick={onPasteClick}>
                  <div className="p-4 sm:h-[120px] flex flex-col sm:flex-col items-start justify-center gap-y-1">
                    <div className="flex items-center gap-x-3 sm:block">
                      <Link2 className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors sm:mb-2 flex-shrink-0" />
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-x-1">
                          <h3 className="text-sm text-left text-primary/80 group-hover:text-primary font-medium sm:text-base">Paste</h3>
                        </div>
                        <p className="text-xs group-hover:text-primary/80 text-left text-primary/60 font-normal sm:text-sm">YouTube, Website, Text</p>
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
                <div className="border-border text-card-foreground shadow-sm rounded-2xl group bg-card cursor-pointer transition-all duration-200 relative hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]" onClick={handleRecordClick}>
                  <div className="p-4 sm:h-[120px] flex flex-col sm:flex-col items-start justify-center gap-y-1">
                    <div className="flex items-center gap-x-3 sm:block">
                      <Mic className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors sm:mb-2 flex-shrink-0" />
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-x-1">
                          <h3 className="text-sm text-left text-primary/80 group-hover:text-primary font-medium sm:text-base">Record</h3>
                        </div>
                        <p className="text-xs group-hover:text-primary/80 text-left text-primary/60 font-medium sm:text-sm">Record Your Lecture</p>
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
    </>;
}
