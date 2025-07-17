
import React from 'react';
import { ContentType } from '@/lib/types';
import { FileText, Music, Play, Globe, MessageSquare, Upload, Mic, Type } from 'lucide-react';

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
      case 'audio_file':
      case 'recording':
        return <Music className={`${className} text-gray-400`} />;
      case 'live_recording':
        return <Mic className={`${className} text-red-500`} />;
      case 'video':
        return <Play className={`${className} text-gray-400`} />;
      case 'youtube':
        return <Play className={`${className} text-red-500`} />;
      case 'website':
        return <Globe className={`${className} text-blue-400`} />;
      case 'text':
        return <Type className={`${className} text-gray-400`} />;
      case 'chat':
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
