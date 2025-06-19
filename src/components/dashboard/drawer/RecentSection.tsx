
import React from 'react';
import { Link } from 'react-router-dom';
import { File, Video, ImageIcon, FileText, Mic, Youtube, Link as LinkIcon, Text } from 'lucide-react';
import { useContentContext } from '@/contexts/ContentContext';

interface ContentTypeIconProps {
  type: string;
}

function ContentTypeIcon({
  type
}: ContentTypeIconProps) {
  switch (type) {
    case 'file':
      return <File className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    case 'pdf':
      return <FileText className="w-4 h-4" />;
    case 'recording':
      return <Mic className="w-4 h-4" />;
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    case 'website':
      return <LinkIcon className="w-4 h-4" />;
    case 'text':
      return <Text className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
}

export function RecentSection() {
  const {
    recentContent
  } = useContentContext();

  if (!recentContent || recentContent.length === 0) {
    return <div className="px-3 py-2 text-sm text-muted-foreground">
        No recent content
      </div>;
  }

  return <div className="space-y-1">
      {recentContent.slice(0, 5).map(item => <Link key={item.id} to={`/content/${item.id}`} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors">
          <div className="flex-shrink-0">
            <ContentTypeIcon type={item.type} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate text-sm">{item.title}</p>
          </div>
        </Link>)}
    </div>;
}
