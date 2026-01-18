/**
 * Token Utilities for AI Context Management
 * Provides token counting and estimation for GPT-4 and similar models
 */

// Token estimation patterns based on GPT tokenization
// Reference: https://platform.openai.com/tokenizer

// Common token patterns - these help with more accurate estimation
const TOKEN_PATTERNS = {
  // Words followed by punctuation often create separate tokens
  wordWithPunctuation: /\b\w+[.!?,;:'"\)\]]+/,
  // Numbers and special formats
  numbers: /\d+\.?\d*/g,
  // URLs are heavily tokenized
  urls: /https?:\/\/[^\s]+/g,
  // Code-like patterns
  codeTokens: /[{}\[\]()=><+\-*/&|^~!@#$%]+/g,
  // Timestamps are tokenized heavily
  timestamps: /\d{1,2}:\d{2}(?::\d{2})?/g,
  // Markdown formatting
  markdown: /[#*_`]+/g,
};

// Average characters per token for different content types
const CHARS_PER_TOKEN_BY_TYPE: Record<string, number> = {
  english: 4.0,      // Standard English text
  technical: 3.5,    // Technical/code content
  transcript: 4.2,   // Speech transcripts (more natural language)
  mixed: 3.8,        // Mixed content
  code: 3.0,         // Programming code
  markdown: 3.5,     // Markdown formatted text
};

export interface TokenEstimate {
  /** Estimated total tokens */
  tokens: number;
  /** Characters in the text */
  characters: number;
  /** Words in the text */
  words: number;
  /** Detected content type */
  contentType: string;
  /** Confidence level (0-1) */
  confidence: number;
}

export interface TokenBudget {
  /** Maximum tokens allowed */
  maxTokens: number;
  /** Tokens used so far */
  usedTokens: number;
  /** Remaining tokens */
  remainingTokens: number;
  /** Percentage used */
  percentUsed: number;
}

/**
 * Detect content type for more accurate token estimation
 */
function detectContentType(text: string): string {
  const codeIndicators = (text.match(/[{}\[\]()=><]+/g) || []).length;
  const urlCount = (text.match(TOKEN_PATTERNS.urls) || []).length;
  const timestampCount = (text.match(TOKEN_PATTERNS.timestamps) || []).length;
  const markdownCount = (text.match(TOKEN_PATTERNS.markdown) || []).length;
  
  const textLength = text.length;
  
  // High code indicator density = code content
  if (codeIndicators / textLength > 0.05) return 'code';
  
  // Many timestamps = transcript
  if (timestampCount > 3 && timestampCount / (textLength / 500) > 0.5) return 'transcript';
  
  // High markdown density
  if (markdownCount / textLength > 0.02) return 'markdown';
  
  // Many URLs = technical
  if (urlCount > 2) return 'technical';
  
  return 'english';
}

/**
 * Quick token estimation using character-based heuristics
 * Accuracy: ~85-90% for most content
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const contentType = detectContentType(text);
  const charsPerToken = CHARS_PER_TOKEN_BY_TYPE[contentType] || 4.0;
  
  // Base estimation
  let estimate = text.length / charsPerToken;
  
  // Adjust for special patterns that create more tokens
  const urlMatches = text.match(TOKEN_PATTERNS.urls) || [];
  estimate += urlMatches.length * 5; // URLs add ~5 extra tokens each
  
  const timestampMatches = text.match(TOKEN_PATTERNS.timestamps) || [];
  estimate += timestampMatches.length * 2; // Timestamps add ~2 extra tokens
  
  const codeMatches = text.match(TOKEN_PATTERNS.codeTokens) || [];
  estimate += codeMatches.length * 0.5; // Code symbols add tokens
  
  return Math.ceil(estimate);
}

/**
 * More accurate token counting using word and pattern analysis
 * Accuracy: ~90-95% for most content
 */
export function countTokens(text: string): TokenEstimate {
  if (!text || text.length === 0) {
    return {
      tokens: 0,
      characters: 0,
      words: 0,
      contentType: 'english',
      confidence: 1.0,
    };
  }
  
  const contentType = detectContentType(text);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // GPT tokenization tends to:
  // - Keep common words as single tokens
  // - Split uncommon/long words into subword tokens
  // - Create separate tokens for punctuation in many cases
  
  let tokenCount = 0;
  
  for (const word of words) {
    if (word.length <= 4) {
      // Short common words are usually 1 token
      tokenCount += 1;
    } else if (word.length <= 8) {
      // Medium words might be 1-2 tokens
      tokenCount += 1.3;
    } else if (word.length <= 12) {
      // Longer words are often 2 tokens
      tokenCount += 1.8;
    } else {
      // Very long words are split into multiple tokens
      tokenCount += Math.ceil(word.length / 4);
    }
    
    // Add for attached punctuation
    const punctuation = word.match(/[.!?,;:'"\)\]]+$/);
    if (punctuation) {
      tokenCount += 0.5;
    }
  }
  
  // Add for special patterns
  const specialPatterns = [
    { pattern: TOKEN_PATTERNS.urls, multiplier: 5 },
    { pattern: TOKEN_PATTERNS.timestamps, multiplier: 2 },
    { pattern: TOKEN_PATTERNS.codeTokens, multiplier: 0.3 },
  ];
  
  for (const { pattern, multiplier } of specialPatterns) {
    const matches = text.match(pattern) || [];
    tokenCount += matches.length * multiplier;
  }
  
  // Calculate confidence based on content type complexity
  let confidence = 0.92;
  if (contentType === 'code') confidence = 0.85;
  if (contentType === 'technical') confidence = 0.88;
  
  return {
    tokens: Math.ceil(tokenCount),
    characters: text.length,
    words: wordCount,
    contentType,
    confidence,
  };
}

/**
 * Create a token budget tracker for context management
 */
export function createTokenBudget(maxTokens: number): TokenBudget {
  return {
    maxTokens,
    usedTokens: 0,
    remainingTokens: maxTokens,
    percentUsed: 0,
  };
}

/**
 * Update token budget after adding content
 */
export function updateTokenBudget(budget: TokenBudget, text: string): TokenBudget {
  const tokens = estimateTokens(text);
  const usedTokens = budget.usedTokens + tokens;
  
  return {
    maxTokens: budget.maxTokens,
    usedTokens,
    remainingTokens: Math.max(0, budget.maxTokens - usedTokens),
    percentUsed: Math.min(100, (usedTokens / budget.maxTokens) * 100),
  };
}

/**
 * Check if text fits within remaining budget
 */
export function fitsInBudget(budget: TokenBudget, text: string): boolean {
  const tokens = estimateTokens(text);
  return tokens <= budget.remainingTokens;
}

/**
 * Truncate text to fit within token limit
 */
export function truncateToTokenLimit(
  text: string,
  maxTokens: number,
  preserveEnd: boolean = false
): { text: string; truncated: boolean; originalTokens: number } {
  const originalTokens = estimateTokens(text);
  
  if (originalTokens <= maxTokens) {
    return { text, truncated: false, originalTokens };
  }
  
  // Estimate characters to keep based on average token ratio
  const contentType = detectContentType(text);
  const charsPerToken = CHARS_PER_TOKEN_BY_TYPE[contentType] || 4.0;
  const targetChars = Math.floor(maxTokens * charsPerToken * 0.95); // 5% buffer
  
  let truncatedText: string;
  
  if (preserveEnd) {
    // Keep the end of the text (useful for recent context)
    truncatedText = '... ' + text.slice(-targetChars);
  } else {
    // Keep the beginning (default behavior)
    truncatedText = text.slice(0, targetChars) + ' ...';
  }
  
  return {
    text: truncatedText,
    truncated: true,
    originalTokens,
  };
}

/**
 * Split text into chunks that fit within token limits
 */
export function splitByTokens(
  text: string,
  maxTokensPerChunk: number,
  overlapTokens: number = 0
): string[] {
  if (!text || text.length === 0) return [];
  
  const contentType = detectContentType(text);
  const charsPerToken = CHARS_PER_TOKEN_BY_TYPE[contentType] || 4.0;
  const targetCharsPerChunk = Math.floor(maxTokensPerChunk * charsPerToken);
  const overlapChars = Math.floor(overlapTokens * charsPerToken);
  
  const chunks: string[] = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = startIndex + targetCharsPerChunk;
    
    if (endIndex >= text.length) {
      chunks.push(text.slice(startIndex));
      break;
    }
    
    // Find a clean break point (sentence or paragraph end)
    const searchStart = Math.max(startIndex, endIndex - 500);
    const searchText = text.slice(searchStart, endIndex);
    
    // Look for paragraph break first
    const paragraphBreak = searchText.lastIndexOf('\n\n');
    if (paragraphBreak > searchText.length * 0.5) {
      endIndex = searchStart + paragraphBreak + 2;
    } else {
      // Look for sentence break
      const sentenceBreak = searchText.lastIndexOf('. ');
      if (sentenceBreak > searchText.length * 0.3) {
        endIndex = searchStart + sentenceBreak + 2;
      }
    }
    
    chunks.push(text.slice(startIndex, endIndex).trim());
    startIndex = endIndex - overlapChars;
  }
  
  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Calculate context window usage for AI prompts
 */
export function calculateContextUsage(
  systemPrompt: string,
  userMessage: string,
  contextContent: string,
  maxContextTokens: number = 8000
): {
  systemTokens: number;
  userTokens: number;
  contextTokens: number;
  totalTokens: number;
  remainingForResponse: number;
  fitsInContext: boolean;
} {
  const systemTokens = estimateTokens(systemPrompt);
  const userTokens = estimateTokens(userMessage);
  const contextTokens = estimateTokens(contextContent);
  const totalTokens = systemTokens + userTokens + contextTokens;
  
  // Reserve ~1500 tokens for response
  const responseReserve = 1500;
  const remainingForResponse = Math.max(0, maxContextTokens - totalTokens);
  
  return {
    systemTokens,
    userTokens,
    contextTokens,
    totalTokens,
    remainingForResponse,
    fitsInContext: totalTokens + responseReserve <= maxContextTokens,
  };
}
