/**
 * Advanced Chapter Parsing Utility
 * 
 * Provides robust chapter extraction from various sources:
 * - YouTube video descriptions (multiple timestamp formats)
 * - Pinned comments
 * - AI-generated chapters from transcripts
 * 
 * Features:
 * - Multiple timestamp format support (H:MM:SS, MM:SS, M:SS, SS)
 * - Title cleanup and normalization
 * - Duplicate detection and removal
 * - Validation and gap filling
 * - Smart merging of overlapping chapters
 */

// Chapter structure with all possible fields
export interface Chapter {
  id: string;
  title: string;
  startTime: number;      // seconds
  endTime?: number;       // seconds
  summary?: string;
  transcript?: string;
  source?: 'description' | 'pinned_comment' | 'ai_generated' | 'manual';
}

// Parsing result with metadata
export interface ChapterParseResult {
  chapters: Chapter[];
  metadata: {
    source: string;
    parseMethod: string;
    originalCount: number;
    cleanedCount: number;
    hadDuplicates: boolean;
    hadOverlaps: boolean;
    gapsFilled: number;
  };
}

// Timestamp patterns ordered by specificity (most specific first)
const TIMESTAMP_PATTERNS = [
  // H:MM:SS or HH:MM:SS - hours:minutes:seconds
  {
    regex: /^[\[\(]?(\d{1,2}):(\d{2}):(\d{2})[\]\)]?\s*[-–—:]?\s*(.+)/,
    parse: (m: RegExpMatchArray) => ({
      hours: parseInt(m[1]),
      minutes: parseInt(m[2]),
      seconds: parseInt(m[3]),
      title: m[4]
    })
  },
  // MM:SS or M:SS - minutes:seconds (most common)
  {
    regex: /^[\[\(]?(\d{1,3}):(\d{2})[\]\)]?\s*[-–—:]?\s*(.+)/,
    parse: (m: RegExpMatchArray) => ({
      hours: 0,
      minutes: parseInt(m[1]),
      seconds: parseInt(m[2]),
      title: m[3]
    })
  },
  // Timestamp at end of line: "Chapter Title 1:23:45" or "Chapter Title (1:23)"
  {
    regex: /^(.+?)\s*[\[\(]?(\d{1,2}):(\d{2}):(\d{2})[\]\)]?\s*$/,
    parse: (m: RegExpMatchArray) => ({
      hours: parseInt(m[2]),
      minutes: parseInt(m[3]),
      seconds: parseInt(m[4]),
      title: m[1]
    })
  },
  {
    regex: /^(.+?)\s*[\[\(]?(\d{1,3}):(\d{2})[\]\)]?\s*$/,
    parse: (m: RegExpMatchArray) => ({
      hours: 0,
      minutes: parseInt(m[2]),
      seconds: parseInt(m[3]),
      title: m[1]
    })
  },
  // With brackets: "[00:00] Title" or "(0:00) Title"
  {
    regex: /^\[(\d{1,2}):(\d{2}):(\d{2})\]\s*(.+)/,
    parse: (m: RegExpMatchArray) => ({
      hours: parseInt(m[1]),
      minutes: parseInt(m[2]),
      seconds: parseInt(m[3]),
      title: m[4]
    })
  },
  {
    regex: /^\[(\d{1,3}):(\d{2})\]\s*(.+)/,
    parse: (m: RegExpMatchArray) => ({
      hours: 0,
      minutes: parseInt(m[1]),
      seconds: parseInt(m[2]),
      title: m[3]
    })
  },
  // Parentheses: "(00:00) Title"
  {
    regex: /^\((\d{1,2}):(\d{2}):(\d{2})\)\s*(.+)/,
    parse: (m: RegExpMatchArray) => ({
      hours: parseInt(m[1]),
      minutes: parseInt(m[2]),
      seconds: parseInt(m[3]),
      title: m[4]
    })
  },
  {
    regex: /^\((\d{1,3}):(\d{2})\)\s*(.+)/,
    parse: (m: RegExpMatchArray) => ({
      hours: 0,
      minutes: parseInt(m[1]),
      seconds: parseInt(m[2]),
      title: m[3]
    })
  }
];

// Common chapter title prefixes to clean
const TITLE_PREFIXES_TO_REMOVE = [
  /^chapter\s*\d*\s*[-–—:.]?\s*/i,
  /^part\s*\d*\s*[-–—:.]?\s*/i,
  /^section\s*\d*\s*[-–—:.]?\s*/i,
  /^segment\s*\d*\s*[-–—:.]?\s*/i,
  /^\d+[.)]\s*/,          // "1. " or "1) "
  /^[-–—•*]\s*/,          // Bullet points
  /^#\d+\s*[-–—:]?\s*/,   // "#1 - "
];

// Characters to clean from titles
const TITLE_CLEANUP_PATTERNS = [
  /\s*[-–—]\s*$/,         // Trailing dashes
  /\s*:\s*$/,             // Trailing colons
  /^\s*[-–—]\s*/,         // Leading dashes
  /\s{2,}/g,              // Multiple spaces
];

/**
 * Parse a single line for chapter timestamp and title
 */
function parseChapterLine(line: string): { startTime: number; title: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 3) return null;
  
  for (const pattern of TIMESTAMP_PATTERNS) {
    const match = trimmed.match(pattern.regex);
    if (match) {
      const parsed = pattern.parse(match);
      const startTime = parsed.hours * 3600 + parsed.minutes * 60 + parsed.seconds;
      const title = cleanChapterTitle(parsed.title);
      
      if (title.length > 0) {
        return { startTime, title };
      }
    }
  }
  
  return null;
}

/**
 * Clean and normalize a chapter title
 */
function cleanChapterTitle(title: string): string {
  let cleaned = title.trim();
  
  // Remove common prefixes
  for (const prefix of TITLE_PREFIXES_TO_REMOVE) {
    cleaned = cleaned.replace(prefix, '');
  }
  
  // Apply cleanup patterns
  for (const pattern of TITLE_CLEANUP_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  
  // Final trim and normalize whitespace
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  // Capitalize first letter if lowercase
  if (cleaned.length > 0 && cleaned[0] === cleaned[0].toLowerCase()) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned;
}

/**
 * Check if two chapter titles are duplicates (fuzzy match)
 */
function areTitlesSimilar(title1: string, title2: string): boolean {
  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n1 = normalize(title1);
  const n2 = normalize(title2);
  
  if (n1 === n2) return true;
  if (n1.includes(n2) || n2.includes(n1)) return true;
  
  // Simple Levenshtein-like similarity check
  if (Math.abs(n1.length - n2.length) > 5) return false;
  
  let matches = 0;
  const shorter = n1.length < n2.length ? n1 : n2;
  const longer = n1.length < n2.length ? n2 : n1;
  
  for (const char of shorter) {
    if (longer.includes(char)) matches++;
  }
  
  return matches / shorter.length > 0.8;
}

/**
 * Parse chapters from a video description
 */
export function parseChaptersFromDescription(description: string): ChapterParseResult {
  const lines = description.split('\n');
  const rawChapters: { startTime: number; title: string }[] = [];
  
  for (const line of lines) {
    const parsed = parseChapterLine(line);
    if (parsed) {
      rawChapters.push(parsed);
    }
  }
  
  // Sort by start time
  rawChapters.sort((a, b) => a.startTime - b.startTime);
  
  // Remove duplicates (same timestamp or very similar titles)
  const deduped: typeof rawChapters = [];
  let hadDuplicates = false;
  
  for (const chapter of rawChapters) {
    const isDuplicate = deduped.some(existing => 
      Math.abs(existing.startTime - chapter.startTime) < 5 || // Within 5 seconds
      areTitlesSimilar(existing.title, chapter.title)
    );
    
    if (!isDuplicate) {
      deduped.push(chapter);
    } else {
      hadDuplicates = true;
    }
  }
  
  // Calculate end times and detect overlaps
  let hadOverlaps = false;
  const chaptersWithEndTimes: Chapter[] = deduped.map((chapter, index) => {
    const nextChapter = deduped[index + 1];
    const endTime = nextChapter ? nextChapter.startTime : undefined;
    
    // Check for overlap (end time before start time of next)
    if (endTime !== undefined && endTime < chapter.startTime) {
      hadOverlaps = true;
    }
    
    return {
      id: `chapter-${index + 1}`,
      title: chapter.title,
      startTime: chapter.startTime,
      endTime,
      source: 'description' as const
    };
  });
  
  return {
    chapters: chaptersWithEndTimes,
    metadata: {
      source: 'description',
      parseMethod: 'timestamp_regex',
      originalCount: rawChapters.length,
      cleanedCount: chaptersWithEndTimes.length,
      hadDuplicates,
      hadOverlaps,
      gapsFilled: 0
    }
  };
}

/**
 * Validate and fix chapters based on video duration
 */
export function validateChapters(
  chapters: Chapter[], 
  videoDuration?: number
): { chapters: Chapter[]; gapsFilled: number; corrections: string[] } {
  if (chapters.length === 0) {
    return { chapters: [], gapsFilled: 0, corrections: [] };
  }
  
  const corrections: string[] = [];
  let gapsFilled = 0;
  
  // Sort by start time
  const sorted = [...chapters].sort((a, b) => a.startTime - b.startTime);
  
  // Validate and fix each chapter
  const validated: Chapter[] = sorted.map((chapter, index) => {
    let { startTime, endTime, ...rest } = chapter;
    
    // Ensure start time is non-negative
    if (startTime < 0) {
      corrections.push(`Fixed negative startTime for "${chapter.title}"`);
      startTime = 0;
    }
    
    // Ensure start time doesn't exceed duration
    if (videoDuration && startTime > videoDuration) {
      corrections.push(`Capped startTime for "${chapter.title}" to video duration`);
      startTime = Math.max(0, videoDuration - 10);
    }
    
    // Calculate or validate end time
    const nextChapter = sorted[index + 1];
    if (nextChapter) {
      endTime = nextChapter.startTime;
    } else if (videoDuration) {
      endTime = videoDuration;
    }
    
    // Ensure end time is after start time
    if (endTime !== undefined && endTime <= startTime) {
      corrections.push(`Fixed invalid endTime for "${chapter.title}"`);
      endTime = startTime + 60; // Default 1 minute if invalid
      if (videoDuration && endTime > videoDuration) {
        endTime = videoDuration;
      }
    }
    
    return { ...rest, startTime, endTime };
  });
  
  // Check for gaps and optionally fill them
  const withGapsFilled: Chapter[] = [];
  for (let i = 0; i < validated.length; i++) {
    const current = validated[i];
    const next = validated[i + 1];
    
    withGapsFilled.push(current);
    
    // Check for large gaps (more than 5% of video duration or 30 seconds)
    if (next && current.endTime !== undefined) {
      const gap = next.startTime - current.endTime;
      const gapThreshold = videoDuration ? Math.max(30, videoDuration * 0.05) : 30;
      
      if (gap > gapThreshold) {
        gapsFilled++;
        // Don't insert filler chapters, just note the gap
        corrections.push(`Gap detected: ${Math.round(gap)}s between "${current.title}" and "${next.title}"`);
      }
    }
  }
  
  return {
    chapters: withGapsFilled,
    gapsFilled,
    corrections
  };
}

/**
 * Merge chapters from multiple sources, preferring more specific ones
 */
export function mergeChapterSources(
  descriptionChapters: Chapter[],
  aiChapters: Chapter[],
  videoDuration?: number
): Chapter[] {
  // If description has good chapters, prefer those
  if (descriptionChapters.length >= 3) {
    const validated = validateChapters(descriptionChapters, videoDuration);
    return validated.chapters;
  }
  
  // If no description chapters, use AI chapters
  if (descriptionChapters.length === 0 && aiChapters.length > 0) {
    const validated = validateChapters(aiChapters, videoDuration);
    return validated.chapters.map(ch => ({ ...ch, source: 'ai_generated' as const }));
  }
  
  // Merge: use description chapters as base, fill gaps with AI chapters
  const merged: Chapter[] = [...descriptionChapters];
  
  for (const aiChapter of aiChapters) {
    // Check if there's already a chapter covering this time
    const covered = merged.some(existing => {
      const existingEnd = existing.endTime ?? (existing.startTime + 60);
      return aiChapter.startTime >= existing.startTime && aiChapter.startTime < existingEnd;
    });
    
    if (!covered) {
      merged.push({ ...aiChapter, source: 'ai_generated' });
    }
  }
  
  // Sort and validate
  merged.sort((a, b) => a.startTime - b.startTime);
  const validated = validateChapters(merged, videoDuration);
  
  return validated.chapters;
}

/**
 * Format chapter time for display
 */
export function formatChapterTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Generate a summary of chapter coverage
 */
export function analyzeChapterCoverage(
  chapters: Chapter[],
  videoDuration: number
): { coverage: number; gaps: Array<{ start: number; end: number }> } {
  if (chapters.length === 0 || videoDuration <= 0) {
    return { coverage: 0, gaps: [{ start: 0, end: videoDuration }] };
  }
  
  const gaps: Array<{ start: number; end: number }> = [];
  let coveredTime = 0;
  
  // Check for gap at start
  if (chapters[0].startTime > 0) {
    gaps.push({ start: 0, end: chapters[0].startTime });
  }
  
  // Calculate coverage and find gaps
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const endTime = chapter.endTime ?? (chapters[i + 1]?.startTime ?? videoDuration);
    
    coveredTime += endTime - chapter.startTime;
    
    // Check for gap before next chapter
    if (i < chapters.length - 1) {
      const next = chapters[i + 1];
      if (next.startTime > endTime) {
        gaps.push({ start: endTime, end: next.startTime });
      }
    }
  }
  
  // Check for gap at end
  const lastChapter = chapters[chapters.length - 1];
  const lastEnd = lastChapter.endTime ?? videoDuration;
  if (lastEnd < videoDuration) {
    gaps.push({ start: lastEnd, end: videoDuration });
  }
  
  const coverage = Math.min(1, coveredTime / videoDuration);
  
  return { coverage, gaps };
}
