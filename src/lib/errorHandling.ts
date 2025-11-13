import { toast } from 'sonner';

export interface UserFriendlyError {
  title: string;
  message: string;
  action: 'retry' | 'contact_support' | 'upgrade' | 'none';
  retryAfter?: number;
  technicalDetails?: string;
}

export const errorMessages: Record<string, UserFriendlyError> = {
  RATE_LIMIT: {
    title: 'Rate Limit Exceeded',
    message: 'You\'ve made too many requests. Please wait a moment and try again.',
    action: 'retry',
    retryAfter: 30000
  },
  NETWORK: {
    title: 'Network Error',
    message: 'Check your internet connection and try again.',
    action: 'retry',
    retryAfter: 5000
  },
  TIMEOUT: {
    title: 'Request Timed Out',
    message: 'The content may be too large. Try breaking it into smaller pieces.',
    action: 'contact_support'
  },
  AUTH_ERROR: {
    title: 'Authentication Error',
    message: 'Your session has expired. Please sign in again.',
    action: 'none'
  },
  API_KEY_ERROR: {
    title: 'Service Unavailable',
    message: 'The AI service is temporarily unavailable. Please try again later.',
    action: 'retry',
    retryAfter: 60000
  },
  INSUFFICIENT_CREDITS: {
    title: 'Insufficient Credits',
    message: 'You\'ve run out of AI credits. Please upgrade your plan to continue.',
    action: 'upgrade'
  },
  INVALID_INPUT: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    action: 'none'
  },
  PROCESSING_ERROR: {
    title: 'Processing Error',
    message: 'We couldn\'t process your request. Please try again.',
    action: 'retry',
    retryAfter: 5000
  },
  UNKNOWN_ERROR: {
    title: 'Unexpected Error',
    message: 'Something unexpected happened. Please try again.',
    action: 'retry',
    retryAfter: 5000
  }
};

export function classifyError(error: any): string {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  if (errorMessage.includes('rate limit') || errorString.includes('429')) {
    return 'RATE_LIMIT';
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch failed') || errorString.includes('network')) {
    return 'NETWORK';
  }
  if (errorMessage.includes('timeout') || errorString.includes('timeout')) {
    return 'TIMEOUT';
  }
  if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized') || errorString.includes('401')) {
    return 'AUTH_ERROR';
  }
  if (errorMessage.includes('api key') || errorString.includes('api key')) {
    return 'API_KEY_ERROR';
  }
  if (errorMessage.includes('credits') || errorMessage.includes('quota') || errorString.includes('402')) {
    return 'INSUFFICIENT_CREDITS';
  }
  if (errorMessage.includes('invalid') || errorMessage.includes('validation')) {
    return 'INVALID_INPUT';
  }
  if (errorMessage.includes('processing') || errorMessage.includes('failed to process')) {
    return 'PROCESSING_ERROR';
  }
  
  return 'UNKNOWN_ERROR';
}

export function handleError(error: any, context: string = 'operation'): UserFriendlyError {
  console.error(`Error in ${context}:`, error);
  
  const errorType = classifyError(error);
  const errorInfo = errorMessages[errorType];
  
  return {
    ...errorInfo,
    technicalDetails: error?.message || String(error)
  };
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

export function showErrorToast(error: UserFriendlyError, onRetry?: () => void) {
  if (error.action === 'retry' && onRetry) {
    toast.error(error.message, {
      action: {
        label: 'Retry',
        onClick: onRetry
      },
      duration: error.retryAfter || 5000
    });
  } else if (error.action === 'upgrade') {
    toast.error(error.message, {
      action: {
        label: 'Upgrade',
        onClick: () => window.location.href = '/pricing'
      }
    });
  } else if (error.action === 'contact_support') {
    toast.error(error.message, {
      action: {
        label: 'Contact Support',
        onClick: () => window.location.href = '/contact'
      }
    });
  } else {
    toast.error(error.message);
  }
}
