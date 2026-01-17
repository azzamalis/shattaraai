/**
 * Retry utility with exponential backoff for external API calls.
 * Use this for all external service calls (OpenAI, YouTube, etc.)
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
  onRetry?: (attempt: number, error: Error, delayMs: number) => void;
  retryableStatusCodes?: number[];
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> & { onRetry?: RetryOptions['onRetry'] } = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  timeoutMs: 120000, // 2 minutes default
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

/**
 * Wraps an async function with retry logic and exponential backoff.
 * 
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => fetch('https://api.openai.com/v1/...'),
 *   { maxRetries: 3, timeoutMs: 60000 }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if we should retry
      const isLastAttempt = attempt > opts.maxRetries;
      const isRetryable = isRetryableError(lastError, opts.retryableStatusCodes);
      
      if (isLastAttempt || !isRetryable) {
        throw lastError;
      }

      // Calculate delay with exponential backoff + jitter
      const exponentialDelay = opts.baseDelayMs * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
      const delay = Math.min(exponentialDelay + jitter, opts.maxDelayMs);

      console.log(`Retry attempt ${attempt}/${opts.maxRetries} after ${Math.round(delay)}ms: ${lastError.message}`);
      opts.onRetry?.(attempt, lastError, delay);

      await sleep(delay);
    }
  }

  throw lastError || new Error('Retry failed without error');
}

/**
 * Wraps a fetch call with timeout support.
 * 
 * @example
 * ```typescript
 * const response = await fetchWithTimeout(
 *   'https://api.openai.com/v1/...',
 *   { method: 'POST', body: JSON.stringify(data) },
 *   60000 // 60 second timeout
 * );
 * ```
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_OPTIONS.timeoutMs
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Combines retry logic with timeout for fetch requests.
 * This is the recommended way to make external API calls.
 * 
 * @example
 * ```typescript
 * const response = await fetchWithRetry(
 *   'https://api.openai.com/v1/audio/transcriptions',
 *   { method: 'POST', body: formData },
 *   { maxRetries: 3, timeoutMs: 120000 }
 * );
 * ```
 */
export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  options: RetryOptions = {}
): Promise<Response> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return withRetry(
    async () => {
      const response = await fetchWithTimeout(url, init, opts.timeoutMs);
      
      // Throw on retryable status codes to trigger retry
      if (!response.ok && opts.retryableStatusCodes.includes(response.status)) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new RetryableError(`HTTP ${response.status}: ${errorText}`, response.status);
      }
      
      return response;
    },
    opts
  );
}

/**
 * Custom error class for retryable errors with status codes.
 */
export class RetryableError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'RetryableError';
  }
}

/**
 * Checks if an error is retryable based on its type and status code.
 */
function isRetryableError(error: Error, retryableStatusCodes: number[]): boolean {
  // Always retry network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }
  
  // Retry timeout errors
  if (error.message.includes('timed out') || error.message.includes('timeout')) {
    return true;
  }
  
  // Retry rate limit errors (429)
  if (error.message.includes('429') || error.message.toLowerCase().includes('rate limit')) {
    return true;
  }
  
  // Check for retryable status codes in error message
  if (error instanceof RetryableError && error.statusCode) {
    return retryableStatusCodes.includes(error.statusCode);
  }
  
  // Check error message for status codes
  for (const code of retryableStatusCodes) {
    if (error.message.includes(String(code))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Simple sleep utility.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Logs retry metrics for monitoring.
 */
export function logRetryMetrics(
  operation: string,
  attempt: number,
  success: boolean,
  durationMs: number,
  error?: Error
): void {
  console.log(JSON.stringify({
    event: 'retry_operation',
    operation,
    attempt,
    success,
    durationMs,
    error: error?.message,
    timestamp: new Date().toISOString(),
  }));
}
