import React from 'react';
import { Box } from 'lucide-react';
interface LearningCardFooterProps {
  roomName?: string;
}
export function LearningCardFooter({
  roomName
}: LearningCardFooterProps) {
  if (!roomName) return null;
  return <div className="flex items-center gap-1.5">
      <Box className="w-3.5 h-3.5" />
      <span className="text-muted-foreground text-xs font-medium truncate">{roomName}</span>
    </div>;
}