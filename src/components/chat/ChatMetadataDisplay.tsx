import React from 'react';
import { ContentItem } from '@/hooks/useContent';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Calendar, 
  Tag, 
  Brain,
  Clock,
  MessageCircle
} from 'lucide-react';

interface ChatMetadataDisplayProps {
  content: ContentItem;
  className?: string;
}

export function ChatMetadataDisplay({ content, className = "" }: ChatMetadataDisplayProps) {
  if (content.type !== 'chat') return null;

  const metadata = content.metadata || {};
  const messageCount = metadata.messageCount || 0;
  const duration = metadata.duration;
  const topics = metadata.topics || [];
  const complexity = metadata.complexity;
  const lastActivity = content.updated_at;

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getComplexityColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'advanced': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stats Row */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{messageCount} messages</span>
        </div>
        
        {duration && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(duration)}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(lastActivity)}</span>
        </div>
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Tag className="h-4 w-4" />
            <span>Topics</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 3).map((topic: string, index: number) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs"
              >
                {topic}
              </Badge>
            ))}
            {topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{topics.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Complexity */}
      {complexity && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Brain className="h-4 w-4" />
            <span>Complexity</span>
          </div>
          <Badge className={getComplexityColor(complexity)}>
            {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
          </Badge>
        </div>
      )}
    </div>
  );
}