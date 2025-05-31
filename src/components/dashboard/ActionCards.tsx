import React, { useRef } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Upload, FileText, Mic, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContent } from '@/contexts/ContentContext';

interface ActionCardsProps {
  onPasteClick: () => void;
}

export function ActionCards({ onPasteClick }: ActionCardsProps) {
  const navigate = useNavigate();
  const { onAddContent } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Determine content type based on file
      let contentType = 'upload';
      if (file.type.includes('pdf')) contentType = 'pdf';
      else if (file.type.includes('audio')) contentType = 'audio';
      else if (file.type.includes('video')) contentType = 'video';

      // Add content to tracking system
      const contentId = onAddContent({
        title: file.name,
        type: contentType as any,
        filename: file.name,
        fileSize: file.size
      });

      // Navigate to content page
      navigate(`/content/${contentId}?type=${contentType}&filename=${encodeURIComponent(file.name)}`);
      toast.success(`File "${file.name}" selected successfully`);
    }
  };

  const handleRecordClick = () => {
    // Add recording to tracking system
    const contentId = onAddContent({
      title: `Recording at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type: 'recording'
    });
    navigate(`/content/${contentId}?type=recording`);
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
                  className="border-border text-card-foreground shadow-sm rounded-2xl group hover:shadow-[var(--shadow-hover)] bg-card cursor-pointer transition-all duration-200 relative"
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
                  className="border-border text-card-foreground shadow-sm rounded-2xl group hover:shadow-[var(--shadow-hover)] bg-card cursor-pointer transition-all duration-200 relative"
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
                  className="border-border text-card-foreground shadow-sm rounded-2xl group hover:shadow-[var(--shadow-hover)] bg-card cursor-pointer transition-all duration-200 relative"
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
