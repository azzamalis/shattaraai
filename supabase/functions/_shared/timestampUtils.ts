// Timestamp utilities for media content processing
// Provides robust timestamp parsing, formatting, and preservation for transcripts

export interface TimestampedWord {
  word: string;
  start: number;  // seconds
  end: number;    // seconds
  confidence?: number;
}

export interface TimestampedSegment {
  text: string;
  startTime: number;   // seconds
  endTime: number;     // seconds
  words?: TimestampedWord[];
  speaker?: string;
  confidence?: number;
}

export interface TimestampRange {
  startSeconds: number;
  endSeconds: number;
  startTimestamp: string;
  endTimestamp: string;
  duration: number;
}

export interface PreservedTimestampChunk {
  id: string;
  content: string;
  cleanContent: string;  // Content without inline timestamps for AI processing
  timestampRange: TimestampRange;
  segments: TimestampedSegment[];
  wordCount: number;
  tokenEstimate: number;
}

export interface TimestampExtractionResult {
  hasTimestamps: boolean;
  format: 'inline' | 'bracketed' | 'parenthetical' | 'segment' | 'word-level' | 'none';
  segments: TimestampedSegment[];
  totalDuration: number;
  coveragePercentage: number;
}

// Common timestamp patterns for parsing
const TIMESTAMP_PATTERNS = {
  // [00:00] or [0:00] or [00:00:00]
  bracketed: /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g,
  // (00:00) or (0:00) or (00:00:00)
  parenthetical: /\((\d{1,2}):(\d{2})(?::(\d{2}))?\)/g,
  // 00:00 or 0:00 or 00:00:00 (standalone)
  inline: /(?:^|\s)(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s|$|[-–:])/g,
  // Speaker pattern: Speaker 1: or John: followed by text
  speaker: /(?:^|\n)(Speaker\s*\d+|[A-Z][a-z]+):\s*/g,
};

/**
 * Parse timestamp string to seconds
 * Supports multiple formats: HH:MM:SS, MM:SS, H:MM:SS, M:SS
 */
export function parseTimestampToSeconds(timestamp: string): number {
  // Clean up brackets, parentheses, and extra characters
  const clean = timestamp.replace(/[\[\]()]/g, '').trim();
  const parts = clean.split(':').map(p => parseInt(p.trim(), 10) || 0);
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    // Just seconds
    return parts[0];
  }
  return 0;
}

/**
 * Format seconds to timestamp string
 * Automatically chooses format based on duration
 */
export function formatSecondsToTimestamp(seconds: number, forceHours = false): string {
  const totalSeconds = Math.floor(Math.max(0, seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  if (hours > 0 || forceHours) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds to human-readable duration
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.floor(Math.max(0, seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}

/**
 * Create a timestamp range object
 */
export function createTimestampRange(startSeconds: number, endSeconds: number): TimestampRange {
  return {
    startSeconds,
    endSeconds,
    startTimestamp: formatSecondsToTimestamp(startSeconds),
    endTimestamp: formatSecondsToTimestamp(endSeconds),
    duration: endSeconds - startSeconds,
  };
}

/**
 * Extract timestamps from content and determine the format used
 */
export function extractTimestampsFromContent(content: string): TimestampExtractionResult {
  const segments: TimestampedSegment[] = [];
  let format: TimestampExtractionResult['format'] = 'none';
  let hasTimestamps = false;
  
  // Try bracketed format first [00:00]
  const bracketedMatches = [...content.matchAll(TIMESTAMP_PATTERNS.bracketed)];
  if (bracketedMatches.length > 0) {
    format = 'bracketed';
    hasTimestamps = true;
    segments.push(...extractSegmentsFromMatches(content, bracketedMatches, /\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g));
  }
  
  // Try parenthetical format (00:00)
  if (!hasTimestamps) {
    const parentheticalMatches = [...content.matchAll(TIMESTAMP_PATTERNS.parenthetical)];
    if (parentheticalMatches.length > 0) {
      format = 'parenthetical';
      hasTimestamps = true;
      segments.push(...extractSegmentsFromMatches(content, parentheticalMatches, /\((\d{1,2}:\d{2}(?::\d{2})?)\)/g));
    }
  }
  
  // Try inline format 00:00
  if (!hasTimestamps) {
    const inlineMatches = [...content.matchAll(TIMESTAMP_PATTERNS.inline)];
    if (inlineMatches.length >= 3) { // Need at least 3 timestamps to be confident
      format = 'inline';
      hasTimestamps = true;
      segments.push(...extractInlineSegments(content, inlineMatches));
    }
  }
  
  // Calculate total duration and coverage
  const totalDuration = segments.length > 0 
    ? Math.max(...segments.map(s => s.endTime)) 
    : 0;
  
  const coveredDuration = segments.reduce((sum, s) => sum + (s.endTime - s.startTime), 0);
  const coveragePercentage = totalDuration > 0 ? (coveredDuration / totalDuration) * 100 : 0;
  
  return {
    hasTimestamps,
    format,
    segments,
    totalDuration,
    coveragePercentage,
  };
}

/**
 * Extract segments from regex matches
 */
function extractSegmentsFromMatches(
  content: string, 
  matches: RegExpMatchArray[],
  pattern: RegExp
): TimestampedSegment[] {
  const segments: TimestampedSegment[] = [];
  
  // Get all timestamp positions and values
  const timestamps: { timestamp: string; seconds: number; index: number; matchLength: number }[] = [];
  
  let match;
  const regex = new RegExp(pattern.source, 'g');
  while ((match = regex.exec(content)) !== null) {
    const timestampStr = match[1];
    timestamps.push({
      timestamp: timestampStr,
      seconds: parseTimestampToSeconds(timestampStr),
      index: match.index,
      matchLength: match[0].length,
    });
  }
  
  // Create segments between timestamps
  for (let i = 0; i < timestamps.length; i++) {
    const current = timestamps[i];
    const next = timestamps[i + 1];
    
    const textStart = current.index + current.matchLength;
    const textEnd = next ? next.index : content.length;
    const text = content.slice(textStart, textEnd).trim();
    
    if (text.length > 0) {
      segments.push({
        text,
        startTime: current.seconds,
        endTime: next ? next.seconds : current.seconds + estimateSegmentDuration(text),
      });
    }
  }
  
  return segments;
}

/**
 * Extract segments from inline timestamps
 */
function extractInlineSegments(content: string, matches: RegExpMatchArray[]): TimestampedSegment[] {
  const segments: TimestampedSegment[] = [];
  const lines = content.split('\n');
  
  let currentTime = 0;
  let currentText = '';
  
  for (const line of lines) {
    const timestampMatch = line.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    
    if (timestampMatch) {
      // Save previous segment if exists
      if (currentText.trim()) {
        const duration = estimateSegmentDuration(currentText);
        segments.push({
          text: currentText.trim(),
          startTime: currentTime,
          endTime: parseTimestampToSeconds(timestampMatch[0]),
        });
      }
      
      currentTime = parseTimestampToSeconds(timestampMatch[0]);
      currentText = line.slice(timestampMatch[0].length).trim();
    } else {
      currentText += ' ' + line;
    }
  }
  
  // Add final segment
  if (currentText.trim()) {
    segments.push({
      text: currentText.trim(),
      startTime: currentTime,
      endTime: currentTime + estimateSegmentDuration(currentText),
    });
  }
  
  return segments;
}

/**
 * Estimate segment duration based on text length (words per minute)
 * Average speaking rate is ~150 words per minute
 */
function estimateSegmentDuration(text: string): number {
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const wordsPerSecond = 150 / 60; // 2.5 words per second
  return Math.max(5, Math.ceil(wordCount / wordsPerSecond)); // Minimum 5 seconds
}

/**
 * Clean content by removing inline timestamps (for AI processing)
 */
export function removeInlineTimestamps(content: string): string {
  return content
    .replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*/g, '')
    .replace(/\((\d{1,2}:\d{2}(?::\d{2})?)\)\s*/g, '')
    .replace(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–:]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Inject timestamps back into clean content at appropriate positions
 */
export function injectTimestamps(cleanContent: string, segments: TimestampedSegment[]): string {
  if (segments.length === 0) return cleanContent;
  
  let result = '';
  let lastEnd = 0;
  
  for (const segment of segments) {
    const timestamp = `[${formatSecondsToTimestamp(segment.startTime)}]`;
    result += `${timestamp} ${segment.text}\n`;
    lastEnd = segment.endTime;
  }
  
  return result.trim();
}

/**
 * Merge adjacent segments that are close in time
 */
export function mergeAdjacentSegments(
  segments: TimestampedSegment[], 
  maxGap: number = 2,
  maxDuration: number = 60
): TimestampedSegment[] {
  if (segments.length === 0) return [];
  
  const merged: TimestampedSegment[] = [];
  let current = { ...segments[0] };
  
  for (let i = 1; i < segments.length; i++) {
    const next = segments[i];
    const gap = next.startTime - current.endTime;
    const wouldBeDuration = next.endTime - current.startTime;
    
    if (gap <= maxGap && wouldBeDuration <= maxDuration) {
      // Merge segments
      current.text += ' ' + next.text;
      current.endTime = next.endTime;
      if (next.words) {
        current.words = [...(current.words || []), ...next.words];
      }
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  
  merged.push(current);
  return merged;
}

/**
 * Split segments that are too long
 */
export function splitLongSegments(
  segments: TimestampedSegment[], 
  maxDuration: number = 30
): TimestampedSegment[] {
  const result: TimestampedSegment[] = [];
  
  for (const segment of segments) {
    const duration = segment.endTime - segment.startTime;
    
    if (duration <= maxDuration) {
      result.push(segment);
      continue;
    }
    
    // Split by sentences
    const sentences = segment.text.split(/(?<=[.!?])\s+/);
    const numParts = Math.ceil(duration / maxDuration);
    const partDuration = duration / numParts;
    
    let currentTime = segment.startTime;
    let currentText = '';
    let partCount = 0;
    
    for (const sentence of sentences) {
      currentText += (currentText ? ' ' : '') + sentence;
      
      // Check if we should create a new part
      const estimatedEnd = currentTime + partDuration;
      if (partCount < numParts - 1 && currentText.length > 50) {
        result.push({
          text: currentText.trim(),
          startTime: currentTime,
          endTime: estimatedEnd,
        });
        currentTime = estimatedEnd;
        currentText = '';
        partCount++;
      }
    }
    
    // Add remaining text
    if (currentText.trim()) {
      result.push({
        text: currentText.trim(),
        startTime: currentTime,
        endTime: segment.endTime,
      });
    }
  }
  
  return result;
}

/**
 * Create timestamp-aware chunks from segments
 */
export function createTimestampAwareChunks(
  segments: TimestampedSegment[],
  maxTokens: number = 1000,
  overlapSeconds: number = 5
): PreservedTimestampChunk[] {
  const chunks: PreservedTimestampChunk[] = [];
  const avgCharsPerToken = 4;
  const maxChars = maxTokens * avgCharsPerToken;
  
  let currentChunk: {
    segments: TimestampedSegment[];
    text: string;
    startTime: number;
    endTime: number;
  } = {
    segments: [],
    text: '',
    startTime: 0,
    endTime: 0,
  };
  
  for (const segment of segments) {
    const segmentChars = segment.text.length;
    const currentChars = currentChunk.text.length;
    
    if (currentChunk.segments.length === 0) {
      currentChunk.startTime = segment.startTime;
    }
    
    if (currentChars + segmentChars > maxChars && currentChunk.segments.length > 0) {
      // Finalize current chunk
      chunks.push(createChunkFromSegments(currentChunk, chunks.length));
      
      // Start new chunk with overlap
      const overlapSegments = currentChunk.segments.filter(
        s => s.endTime > currentChunk.endTime - overlapSeconds
      );
      
      currentChunk = {
        segments: [...overlapSegments],
        text: overlapSegments.map(s => s.text).join(' '),
        startTime: overlapSegments.length > 0 ? overlapSegments[0].startTime : segment.startTime,
        endTime: segment.endTime,
      };
    }
    
    currentChunk.segments.push(segment);
    currentChunk.text += (currentChunk.text ? ' ' : '') + segment.text;
    currentChunk.endTime = segment.endTime;
  }
  
  // Add final chunk
  if (currentChunk.segments.length > 0) {
    chunks.push(createChunkFromSegments(currentChunk, chunks.length));
  }
  
  return chunks;
}

/**
 * Create a chunk object from accumulated segments
 */
function createChunkFromSegments(
  chunkData: { segments: TimestampedSegment[]; text: string; startTime: number; endTime: number },
  index: number
): PreservedTimestampChunk {
  const content = chunkData.segments.map(s => 
    `[${formatSecondsToTimestamp(s.startTime)}] ${s.text}`
  ).join('\n');
  
  const cleanContent = chunkData.segments.map(s => s.text).join(' ');
  const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;
  
  return {
    id: `media_chunk_${index}`,
    content,
    cleanContent,
    timestampRange: createTimestampRange(chunkData.startTime, chunkData.endTime),
    segments: chunkData.segments,
    wordCount,
    tokenEstimate: Math.ceil(cleanContent.length / 4),
  };
}

/**
 * Find the segment containing a specific timestamp
 */
export function findSegmentAtTime(segments: TimestampedSegment[], timeSeconds: number): TimestampedSegment | null {
  for (const segment of segments) {
    if (timeSeconds >= segment.startTime && timeSeconds < segment.endTime) {
      return segment;
    }
  }
  return null;
}

/**
 * Get segments within a time range
 */
export function getSegmentsInRange(
  segments: TimestampedSegment[], 
  startSeconds: number, 
  endSeconds: number
): TimestampedSegment[] {
  return segments.filter(s => 
    (s.startTime >= startSeconds && s.startTime < endSeconds) ||
    (s.endTime > startSeconds && s.endTime <= endSeconds) ||
    (s.startTime <= startSeconds && s.endTime >= endSeconds)
  );
}

/**
 * Convert word-level timing to segments
 */
export function wordsToSegments(
  words: TimestampedWord[], 
  segmentDuration: number = 10
): TimestampedSegment[] {
  if (words.length === 0) return [];
  
  const segments: TimestampedSegment[] = [];
  let currentSegment: { words: TimestampedWord[]; text: string; startTime: number } | null = null;
  
  for (const word of words) {
    const segmentStart = Math.floor(word.start / segmentDuration) * segmentDuration;
    
    if (!currentSegment || currentSegment.startTime !== segmentStart) {
      if (currentSegment) {
        segments.push({
          text: currentSegment.text.trim(),
          startTime: currentSegment.startTime,
          endTime: currentSegment.words[currentSegment.words.length - 1].end,
          words: currentSegment.words,
        });
      }
      currentSegment = {
        words: [],
        text: '',
        startTime: segmentStart,
      };
    }
    
    currentSegment.words.push(word);
    currentSegment.text += (currentSegment.text ? ' ' : '') + word.word;
  }
  
  // Add final segment
  if (currentSegment && currentSegment.words.length > 0) {
    segments.push({
      text: currentSegment.text.trim(),
      startTime: currentSegment.startTime,
      endTime: currentSegment.words[currentSegment.words.length - 1].end,
      words: currentSegment.words,
    });
  }
  
  return segments;
}

/**
 * Validate and fix timestamp continuity
 */
export function validateTimestampContinuity(segments: TimestampedSegment[]): TimestampedSegment[] {
  if (segments.length === 0) return [];
  
  const validated: TimestampedSegment[] = [];
  let lastEndTime = 0;
  
  for (const segment of segments) {
    const fixed = { ...segment };
    
    // Ensure start time is not before last end time
    if (fixed.startTime < lastEndTime) {
      fixed.startTime = lastEndTime;
    }
    
    // Ensure end time is after start time
    if (fixed.endTime <= fixed.startTime) {
      fixed.endTime = fixed.startTime + estimateSegmentDuration(fixed.text);
    }
    
    validated.push(fixed);
    lastEndTime = fixed.endTime;
  }
  
  return validated;
}

/**
 * Calculate timestamp accuracy metrics
 */
export function calculateTimestampMetrics(segments: TimestampedSegment[]): {
  totalDuration: number;
  averageSegmentDuration: number;
  segmentCount: number;
  gapCount: number;
  totalGapDuration: number;
  coveragePercentage: number;
} {
  if (segments.length === 0) {
    return {
      totalDuration: 0,
      averageSegmentDuration: 0,
      segmentCount: 0,
      gapCount: 0,
      totalGapDuration: 0,
      coveragePercentage: 0,
    };
  }
  
  const totalDuration = segments[segments.length - 1].endTime;
  let totalGapDuration = 0;
  let gapCount = 0;
  
  for (let i = 1; i < segments.length; i++) {
    const gap = segments[i].startTime - segments[i - 1].endTime;
    if (gap > 0) {
      gapCount++;
      totalGapDuration += gap;
    }
  }
  
  const coveredDuration = segments.reduce((sum, s) => sum + (s.endTime - s.startTime), 0);
  
  return {
    totalDuration,
    averageSegmentDuration: coveredDuration / segments.length,
    segmentCount: segments.length,
    gapCount,
    totalGapDuration,
    coveragePercentage: totalDuration > 0 ? (coveredDuration / totalDuration) * 100 : 0,
  };
}
