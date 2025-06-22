
import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
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

// Helper function to get content type icon
const getContentTypeIcon = (type: string) => {
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

export const RecentSection: React.FC = () => {
  const { recentContent } = useContent();

  if (!recentContent || recentContent.length === 0) {
    return (
      <div className="text-xs text-muted-foreground text-center py-4">
        No recent content
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {recentContent.slice(0, 5).map((content) => (
        <Link
          key={content.id}
          to={`/content/${content.id}?type=${content.type}`}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors duration-200 group"
        >
          {getContentTypeIcon(content.type)}
          <span className="text-sm text-foreground group-hover:text-foreground truncate flex-1">
            {content.title}
          </span>
        </Link>
      ))}
    </div>
  );
};
