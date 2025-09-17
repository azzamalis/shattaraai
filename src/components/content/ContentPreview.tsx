import React from 'react';
import { ContentType } from '@/lib/types';
import { 
  FileText, 
  AudioLines, 
  Play, 
  Globe, 
  MessageSquare, 
  Upload, 
  Mic, 
  Type,
  Sparkles,
  Calendar,
  MessageCircle
} from 'lucide-react';

interface ChatContentPreviewProps {
  messageCount?: number;
  lastActivity?: string;
  topic?: string;
  className?: string;
}

export function ChatContentPreview({ 
  messageCount = 0, 
  lastActivity, 
  topic,
  className = "w-full h-32" 
}: ChatContentPreviewProps) {
  const formatLastActivity = (activity?: string) => {
    if (!activity) return 'No recent activity';
    
    const date = new Date(activity);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`${className} bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20`}>
      <div className="flex flex-col h-full justify-between">
        {/* Header with chat icon */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-primary/70" />
            <span className="text-xs font-medium text-primary/80">AI Chat</span>
          </div>
        </div>

        {/* Topic preview */}
        {topic && (
          <div className="mb-2">
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {topic}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground/70">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{messageCount} messages</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatLastActivity(lastActivity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContentPreviewProps {
  type: ContentType;
  filename?: string;
  title?: string;
  className?: string;
  metadata?: Record<string, any>;
}

export function ContentPreview({ 
  type, 
  filename, 
  title, 
  className = "w-16 h-16",
  metadata 
}: ContentPreviewProps) {
  
  // Special handling for chat content
  if (type === 'chat') {
    return (
      <ChatContentPreview
        messageCount={metadata?.messageCount}
        lastActivity={metadata?.lastActivity}
        topic={title}
        className={className}
      />
    );
  }

  const getPreviewContent = () => {
    switch (type) {
      case 'pdf':
      case 'upload':
        return <FileText className={`${className} text-gray-400`} />;
      case 'audio_file':
      case 'recording':
        return <AudioLines className={`${className} text-gray-400`} />;
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