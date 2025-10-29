
import React from 'react';
import { 
  FileText, 
  Play, 
  Youtube, 
  Mic, 
  Globe, 
  MessageSquare, 
  AudioLines, 
  Upload, 
  Type,
  Text 
} from 'lucide-react';

interface ContentTypeIconProps {
  type: string;
  className?: string;
}

export const ContentTypeIcon: React.FC<ContentTypeIconProps> = ({ type, className = "h-4 w-4 text-primary/60" }) => {
  const iconClass = className;
  
  switch (type) {
    case 'video':
      return <Play className={iconClass} />;
    case 'pdf':
      return <Text className={iconClass} />;
    case 'file':
      return <FileText className={iconClass} />;
    case 'recording':
    case 'live_recording':
      return <Mic className={iconClass} />;
    case 'youtube':
      return <Youtube className={iconClass} />;
    case 'website':
      return <Globe className={iconClass} />;
    case 'text':
      return <Type className={iconClass} />;
    case 'audio_file':
      return <AudioLines className={iconClass} />;
    case 'upload':
      return <Upload className={iconClass} />;
    case 'chat':
      return <MessageSquare className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};
