import React, { useRef } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Upload, FileText, Mic } from 'lucide-react';
import { FileIcon, LinkIcon, MicIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContent } from '@/contexts/ContentContext';
interface ActionCardProps {
  onPasteClick: () => void;
}
export function ActionCards({
  onPasteClick
}: ActionCardProps) {
  const navigate = useNavigate();
  const {
    onAddContent
  } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Determine content type based on file
      let contentType = 'upload';
      if (file.type.includes('pdf')) contentType = 'pdf';else if (file.type.includes('audio')) contentType = 'audio';else if (file.type.includes('video')) contentType = 'video';

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
      title: `Recording at ${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`,
      type: 'recording'
    });
    navigate(`/content/${contentId}?type=recording`);
  };
  return <>
      <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,audio/*,video/*" onChange={handleFileSelect} style={{
      display: 'none'
    }} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
        {/* Upload Document Card */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card onClick={handleUploadClick} className="bg-[#FDFDFD] border border-[#E6E6E6] hover:border-white/40 hover:bg-white/5 transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer group">
                <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full group-hover:border-white/20">
                  <Upload className="h-6 w-6 md:h-8 md:w-8 text-[#0A0A0A]" />
                </div>
                <CardTitle className="text-[#0A0A0A] mb-1 md:mb-2 text-base md:text-xl">Upload</CardTitle>
                <CardDescription className="text-gray-400 text-xs md:text-sm">File, Audio, Video</CardDescription>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
              <p className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-gray-400" />
                Supported file types: PDF, PPT, DOC, TXT, Audio, Video
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Paste Text Card */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card onClick={onPasteClick} className="bg-[#FDFDFD] border border-[#E6E6E6] hover:border-white/40 hover:bg-white/5 transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer group">
                <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full group-hover:border-white/20">
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-[#0A0A0A]" />
                </div>
                <CardTitle className="text-[#0A0A0A] mb-1 md:mb-2 text-base md:text-xl">Paste</CardTitle>
                <CardDescription className="text-gray-400 text-xs md:text-sm">YouTube, Website, Text</CardDescription>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
              <p className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                YouTube Link, Website URL, Text content
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Record Audio Card */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card onClick={handleRecordClick} className="bg-[#FDFDFD] border border-[#E6E6E6] hover:border-white/40 hover:bg-white/5 transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer group">
                <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full group-hover:border-white/20">
                  <Mic className="h-6 w-6 md:h-8 md:w-8 text-[#0A0A0A]" />
                </div>
                <CardTitle className="text-[#0A0A0A] mb-1 md:mb-2 text-base md:text-xl">Record</CardTitle>
                <CardDescription className="text-gray-400 text-xs md:text-sm">Record Your Lecture</CardDescription>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
              <p className="flex items-center gap-2">
                <MicIcon className="h-4 w-4 text-gray-400" />
                Record your lectures in real-time
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>;
}