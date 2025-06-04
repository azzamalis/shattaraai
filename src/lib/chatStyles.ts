import { cn } from '@/lib/utils';

export const chatMessageStyles = {
  container: "space-y-4 p-4",
  wrapper: (isUser: boolean) => `flex ${isUser ? 'justify-end' : 'justify-start'}`,
  bubble: (isUser: boolean) => cn(
    "group relative max-w-[80%] rounded-lg px-4 py-3",
    isUser 
      ? "bg-[#00A3FF] text-white" 
      : "bg-dashboard-card dark:bg-dashboard-card text-dashboard-text dark:text-dashboard-text"
  ),
  content: "text-sm",
  timestamp: cn(
    "text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60 mt-1",
    "flex items-center gap-1"
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
