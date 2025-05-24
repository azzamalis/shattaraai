
import React from 'react';
import { ContentType } from '@/lib/types';
import { FileText, Music, Video, Globe, MessageSquare, Upload, Mic } from 'lucide-react';

interface ContentPreviewProps {
  type: ContentType;
  filename?: string;
  title?: string;
  className?: string;
}

export function ContentPreview({ type, filename, title, className = "w-16 h-16" }: ContentPreviewProps) {
  const getPreviewContent = () => {
    switch (type) {
      case 'pdf':
      case 'upload':
        return <FileText className={`${className} text-gray-400`} />;
      case 'audio':
      case 'recording':
        return <Music className={`${className} text-gray-400`} />;
      case 'video':
        return <Video className={`${className} text-gray-400`} />;
      case 'youtube':
        return <Video className={`${className} text-red-500`} />;
      case 'website':
        return <Globe className={`${className} text-blue-400`} />;
      case 'text':
        return <MessageSquare className={`${className} text-gray-400`} />;
      default:
        return <MessageSquare className={`${className} text-gray-400`} />;
    }
  };

  return (
    <div className="flex justify-center items-center">
      {getPreviewContent()}
    </div>
  );
}
