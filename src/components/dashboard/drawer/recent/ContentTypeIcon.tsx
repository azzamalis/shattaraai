
import React from 'react';
import { 
  FileText, 
  Video, 
  Youtube, 
  Mic, 
  Globe, 
  MessageSquare, 
  Music, 
  Upload, 
  Type 
} from 'lucide-react';

interface ContentTypeIconProps {
  type: string;
}

export const ContentTypeIcon: React.FC<ContentTypeIconProps> = ({ type }) => {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-primary/60" />;
    case 'pdf':
    case 'file':
      return <FileText className="h-4 w-4 text-primary/60" />;
    case 'recording':
    case 'live_recording':
      return <Mic className="h-4 w-4 text-primary/60" />;
    case 'youtube':
      return <Youtube className="h-4 w-4 text-primary/60" />;
    case 'website':
      return <Globe className="h-4 w-4 text-primary/60" />;
    case 'text':
      return <Type className="h-4 w-4 text-primary/60" />;
    case 'audio_file':
      return <Music className="h-4 w-4 text-primary/60" />;
    case 'upload':
      return <Upload className="h-4 w-4 text-primary/60" />;
    case 'chat':
      return <MessageSquare className="h-4 w-4 text-primary/60" />;
    default:
      return <FileText className="h-4 w-4 text-primary/60" />;
  }
};
