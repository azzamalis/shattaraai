
import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, FileText, Mic, Upload, FileIcon, LinkIcon, MicIcon } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tooltipContent: React.ReactNode;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  title, description, icon, tooltipContent, onClick 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer group"
            onClick={onClick}
          >
            <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full group-hover:border-white/20">
              {icon}
            </div>
            <CardTitle className="text-white mb-1 md:mb-2 text-base md:text-lg">{title}</CardTitle>
            <CardDescription className="text-gray-400 text-xs md:text-sm">{description}</CardDescription>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm rounded-lg shadow-xl" sideOffset={5}>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ContentCards: React.FC<{
  onPasteClick: () => void;
}> = ({ onPasteClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
      {/* Upload Document Card */}
      <ContentCard
        title="Upload"
        description="File, Audio, Video"
        icon={<Upload className="h-6 w-6 md:h-8 md:w-8 text-white" />}
        tooltipContent={
          <p className="flex items-center gap-2">
            <FileIcon className="h-4 w-4 text-gray-400" />
            Supported file types: PDF, PPT, DOC, TXT, Audio, Video
          </p>
        }
      />
      
      {/* Paste Text Card */}
      <ContentCard
        title="Paste"
        description="YouTube, Website, Text"
        icon={<FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />}
        tooltipContent={
          <p className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-gray-400" />
            YouTube Link, Website URL, Text content
          </p>
        }
        onClick={onPasteClick}
      />
      
      {/* Record Audio Card */}
      <ContentCard
        title="Record"
        description="Record Your Lecture"
        icon={<Mic className="h-6 w-6 md:h-8 md:w-8 text-white" />}
        tooltipContent={
          <p className="flex items-center gap-2">
            <MicIcon className="h-4 w-4 text-gray-400" />
            Record your lectures in real-time
          </p>
        }
      />
    </div>
  );
};
