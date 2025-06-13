
import React, { useState } from 'react';
import { ContentItem } from '@/lib/types';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Video, 
  Youtube, 
  Mic, 
  Globe, 
  MoreVertical,
  Share2,
  Trash2,
  FolderPlus,
  Clock,
  Eye
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface EnhancedLearningCardProps {
  content: ContentItem;
  onDelete: () => void;
  onShare: () => void;
  onAddToRoom?: (roomId: string) => void;
  availableRooms?: Array<{ id: string; name: string }>;
  currentRoom?: { id: string; name: string };
}

const getContentIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'youtube':
      return <Youtube className="h-5 w-5" />;
    case 'recording':
      return <Mic className="h-5 w-5" />;
    case 'website':
      return <Globe className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getContentTypeColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'text-red-500';
    case 'video':
      return 'text-blue-500';
    case 'youtube':
      return 'text-red-600';
    case 'recording':
      return 'text-purple-500';
    case 'website':
      return 'text-green-500';
    default:
      return 'text-muted-foreground';
  }
};

export function EnhancedLearningCard({
  content,
  onDelete,
  onShare,
  onAddToRoom,
  availableRooms = [],
  currentRoom
}: EnhancedLearningCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const progress = content.metadata?.progress || 0;
  const progressPercentage = Math.round(progress * 100);
  
  const handleCardClick = () => {
    navigate(`/content/${content.id}?type=${content.type}`);
  };

  const handleRoomAdd = (roomId: string) => {
    if (onAddToRoom) {
      onAddToRoom(roomId);
    }
  };

  return (
    <EnhancedCard
      hover
      className="group relative overflow-hidden border-border/50 hover:border-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn("p-2 rounded-lg bg-muted/50", getContentTypeColor(content.type))}>
            {getContentIcon(content.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 mb-1">
              {content.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-opacity",
                "opacity-0 group-hover:opacity-100",
                isHovered && "opacity-100"
              )}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleCardClick}>
              <Eye className="h-4 w-4 mr-2" />
              View Content
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            {availableRooms.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Add to Room
                </div>
                {availableRooms
                  .filter(room => room.id !== currentRoom?.id)
                  .slice(0, 3)
                  .map(room => (
                    <DropdownMenuItem
                      key={room.id}
                      onClick={() => handleRoomAdd(room.id)}
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      {room.name}
                    </DropdownMenuItem>
                  ))}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress Section */}
      {progress > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {/* Tags */}
      {content.metadata?.contentTags && content.metadata.contentTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {content.metadata.contentTags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
              {tag}
            </Badge>
          ))}
          {content.metadata.contentTags.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{content.metadata.contentTags.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Current Room Badge */}
      {currentRoom && (
        <Badge variant="outline" className="text-xs">
          In {currentRoom.name}
        </Badge>
      )}

      {/* Click overlay */}
      <motion.div
        className="absolute inset-0 bg-primary/5 opacity-0 cursor-pointer"
        whileHover={{ opacity: 1 }}
        onClick={handleCardClick}
      />
    </EnhancedCard>
  );
}
