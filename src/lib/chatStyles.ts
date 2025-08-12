
import { cn } from '@/lib/utils';

export const chatMessageStyles = {
  container: "space-y-6 p-6",
  wrapper: (isUser: boolean) => cn(
    "w-full",
    isUser ? "border-l-2 border-primary/20 pl-4" : ""
  ),
  content: cn(
    "prose prose-sm max-w-none",
    "prose-headings:text-foreground prose-headings:font-semibold",
    "prose-p:text-foreground prose-p:leading-relaxed",
    "prose-strong:text-foreground prose-strong:font-semibold",
    "prose-ul:text-foreground prose-ol:text-foreground",
    "prose-li:text-foreground prose-li:leading-relaxed",
    "prose-code:text-foreground prose-code:bg-muted",
    "prose-pre:bg-muted prose-pre:text-foreground",
    "prose-blockquote:text-muted-foreground prose-blockquote:border-border",
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
    "break-words hyphens-auto"
  ),
  userLabel: "text-xs font-medium text-primary mb-2 flex items-center gap-2",
  aiLabel: "text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2",
  timestamp: cn(
    "text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50",
    "flex items-center gap-2"
  ),
  status: {
    container: "flex items-center gap-1",
    icon: "h-3 w-3"
  }
};

export const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
