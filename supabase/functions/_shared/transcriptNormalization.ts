/**
 * Transcript Normalization Utility
 * Cleans up filler words, repetitions, and normalizes spacing for better AI processing
 */

// Common filler words and phrases to remove or reduce
const FILLER_WORDS = [
  'um', 'uh', 'umm', 'uhh', 'er', 'err', 'ah', 'ahh',
  'like', 'you know', 'i mean', 'basically', 'actually',
  'literally', 'honestly', 'obviously', 'essentially',
  'sort of', 'kind of', 'right', 'okay so', 'so basically',
  'well um', 'well uh', 'and um', 'and uh', 'but um', 'but uh'
];

// Build regex patterns for filler words (case insensitive, word boundaries)
const FILLER_PATTERNS = FILLER_WORDS.map(word => 
  new RegExp(`\\b${word.replace(/\s+/g, '\\s+')}\\b`, 'gi')
);

// Pattern to detect repeated words (e.g., "I I think" → "I think")
const REPEATED_WORD_PATTERN = /\b(\w+)\s+\1\b/gi;

// Pattern to detect repeated phrases (2-3 words repeated)
const REPEATED_PHRASE_PATTERN = /\b((\w+\s+){1,3})\1/gi;

// Pattern for multiple spaces
const MULTIPLE_SPACES_PATTERN = /\s{2,}/g;

// Pattern for multiple punctuation
const MULTIPLE_PUNCTUATION_PATTERN = /([.!?,;:])\1+/g;

// Pattern for spaces before punctuation
const SPACE_BEFORE_PUNCTUATION_PATTERN = /\s+([.!?,;:])/g;

// Pattern for sentence start (to capitalize)
const SENTENCE_START_PATTERN = /(?:^|[.!?]\s+)([a-z])/g;

export interface NormalizationResult {
  /** Cleaned and normalized transcript text */
  cleaned: string;
  /** Original raw transcript text */
  raw: string;
  /** Number of filler words/phrases removed */
  fillerCount: number;
  /** Number of repetitions fixed */
  repetitionCount: number;
  /** Percentage of text that was cleaned */
  cleanupPercentage: number;
  /** Processing metadata */
  metadata: {
    originalLength: number;
    cleanedLength: number;
    processingTimeMs: number;
  };
}

export interface NormalizationOptions {
  /** Remove filler words (default: true) */
  removeFillers?: boolean;
  /** Fix repeated words (default: true) */
  fixRepetitions?: boolean;
  /** Normalize spacing and punctuation (default: true) */
  normalizeSpacing?: boolean;
  /** Capitalize sentence starts (default: true) */
  capitalizeSentences?: boolean;
  /** Custom filler words to remove in addition to defaults */
  customFillers?: string[];
  /** Preserve certain words from being removed (whitelist) */
  preserveWords?: string[];
}

const DEFAULT_OPTIONS: NormalizationOptions = {
  removeFillers: true,
  fixRepetitions: true,
  normalizeSpacing: true,
  capitalizeSentences: true,
  customFillers: [],
  preserveWords: [],
};

/**
 * Normalizes a transcript by removing filler words, fixing repetitions,
 * and cleaning up spacing/punctuation.
 */
export function normalizeTranscript(
  text: string,
  options: NormalizationOptions = {}
): NormalizationResult {
  const startTime = Date.now();
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!text || typeof text !== 'string') {
    return {
      cleaned: '',
      raw: text || '',
      fillerCount: 0,
      repetitionCount: 0,
      cleanupPercentage: 0,
      metadata: {
        originalLength: 0,
        cleanedLength: 0,
        processingTimeMs: 0,
      },
    };
  }

  const raw = text;
  let cleaned = text;
  let fillerCount = 0;
  let repetitionCount = 0;

  // Build preserve list pattern
  const preservePattern = opts.preserveWords && opts.preserveWords.length > 0
    ? new RegExp(`\\b(${opts.preserveWords.join('|')})\\b`, 'gi')
    : null;

  // Step 1: Remove filler words
  if (opts.removeFillers) {
    // Add custom fillers to patterns
    const allPatterns = [...FILLER_PATTERNS];
    if (opts.customFillers && opts.customFillers.length > 0) {
      opts.customFillers.forEach(word => {
        allPatterns.push(new RegExp(`\\b${word.replace(/\s+/g, '\\s+')}\\b`, 'gi'));
      });
    }

    for (const pattern of allPatterns) {
      const matches = cleaned.match(pattern);
      if (matches) {
        // Check if any match is in preserve list
        const filteredMatches = preservePattern
          ? matches.filter(m => !preservePattern.test(m))
          : matches;
        fillerCount += filteredMatches.length;
      }
      // Replace with single space to avoid word concatenation
      cleaned = cleaned.replace(pattern, ' ');
    }
  }

  // Step 2: Fix repeated words
  if (opts.fixRepetitions) {
    // Fix repeated single words (e.g., "I I think" → "I think")
    let prevCleaned = '';
    while (prevCleaned !== cleaned) {
      prevCleaned = cleaned;
      const matches = cleaned.match(REPEATED_WORD_PATTERN);
      if (matches) {
        repetitionCount += matches.length;
      }
      cleaned = cleaned.replace(REPEATED_WORD_PATTERN, '$1');
    }

    // Fix repeated short phrases
    prevCleaned = '';
    while (prevCleaned !== cleaned) {
      prevCleaned = cleaned;
      const matches = cleaned.match(REPEATED_PHRASE_PATTERN);
      if (matches) {
        repetitionCount += matches.length;
      }
      cleaned = cleaned.replace(REPEATED_PHRASE_PATTERN, '$1');
    }
  }

  // Step 3: Normalize spacing and punctuation
  if (opts.normalizeSpacing) {
    // Fix multiple spaces
    cleaned = cleaned.replace(MULTIPLE_SPACES_PATTERN, ' ');
    
    // Fix multiple punctuation
    cleaned = cleaned.replace(MULTIPLE_PUNCTUATION_PATTERN, '$1');
    
    // Remove spaces before punctuation
    cleaned = cleaned.replace(SPACE_BEFORE_PUNCTUATION_PATTERN, '$1');
    
    // Trim
    cleaned = cleaned.trim();
  }

  // Step 4: Capitalize sentence starts
  if (opts.capitalizeSentences) {
    // Capitalize first letter
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    // Capitalize after sentence-ending punctuation
    cleaned = cleaned.replace(SENTENCE_START_PATTERN, (match, letter) => {
      return match.slice(0, -1) + letter.toUpperCase();
    });
  }

  const processingTimeMs = Date.now() - startTime;
  const cleanupPercentage = raw.length > 0 
    ? Math.round(((raw.length - cleaned.length) / raw.length) * 100 * 10) / 10
    : 0;

  return {
    cleaned,
    raw,
    fillerCount,
    repetitionCount,
    cleanupPercentage,
    metadata: {
      originalLength: raw.length,
      cleanedLength: cleaned.length,
      processingTimeMs,
    },
  };
}

/**
 * Normalizes transcript segments while preserving timing information
 */
export function normalizeTranscriptSegments(
  segments: Array<{ text: string; start?: number; end?: number; [key: string]: unknown }>,
  options: NormalizationOptions = {}
): Array<{ text: string; start?: number; end?: number; [key: string]: unknown }> {
  return segments.map(segment => ({
    ...segment,
    text: normalizeTranscript(segment.text, options).cleaned,
  }));
}

/**
 * Combines multiple transcript segments into a single normalized text
 */
export function combineAndNormalizeSegments(
  segments: Array<{ text: string; [key: string]: unknown }>,
  options: NormalizationOptions = {}
): NormalizationResult {
  const combinedText = segments.map(s => s.text).join(' ');
  return normalizeTranscript(combinedText, options);
}

/**
 * Quick check if a transcript likely needs normalization
 * Useful for deciding whether to run full normalization
 */
export function needsNormalization(text: string): boolean {
  if (!text || text.length < 50) return false;
  
  // Check for filler words
  for (const pattern of FILLER_PATTERNS.slice(0, 10)) { // Check first 10 patterns
    if (pattern.test(text)) return true;
  }
  
  // Check for repeated words
  if (REPEATED_WORD_PATTERN.test(text)) return true;
  
  // Check for multiple spaces
  if (MULTIPLE_SPACES_PATTERN.test(text)) return true;
  
  return false;
}
