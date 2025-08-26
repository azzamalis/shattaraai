import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Clock, FileText, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStatusIndicatorProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stage?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProcessingStatusIndicator: React.FC<ProcessingStatusIndicatorProps> = ({
  status,
  stage,
  showText = true,
  size = 'md'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: Loader2,
          text: stage ? `Processing ${stage}...` : 'Processing...',
          variant: 'secondary' as const,
          className: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
          iconClassName: 'animate-spin text-blue-600 dark:text-blue-400'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Processing complete',
          variant: 'secondary' as const,
          className: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300',
          iconClassName: 'text-green-600 dark:text-green-400'
        };
      case 'failed':
        return {
          icon: AlertCircle,
          text: 'Processing failed',
          variant: 'destructive' as const,
          className: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300',
          iconClassName: 'text-red-600 dark:text-red-400'
        };
      default: // pending
        return {
          icon: Clock,
          text: 'Waiting to process',
          variant: 'secondary' as const,
          className: 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300',
          iconClassName: 'text-gray-500 dark:text-gray-400'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (!showText) {
    return (
      <Icon className={cn(sizeClasses[size], config.iconClassName)} />
    );
  }

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 font-medium',
        config.className,
        textSizeClasses[size]
      )}
    >
      <Icon className={cn(sizeClasses[size], config.iconClassName)} />
      {config.text}
    </Badge>
  );
};

export default ProcessingStatusIndicator;