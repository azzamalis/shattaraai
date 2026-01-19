// Semantic Boundary Detection for Content Chunking
// Phase 7: Detects natural topic transitions for intelligent content splitting

export interface TopicSignal {
  type: 'transition' | 'new_topic' | 'subtopic' | 'conclusion' | 'example' | 'continuation';
  strength: number;  // 0-1, how strong the signal is
  position: number;  // character offset in content
  reason: string;    // why this was detected
}

export interface SemanticBoundary {
  position: number;
  lineIndex: number;
  score: number;     // 0-1, higher = stronger boundary
  type: 'topic_shift' | 'section_break' | 'paragraph' | 'speaker_change' | 'time_jump' | 'structural';
  context: {
    beforeText: string;  // ~50 chars before
    afterText: string;   // ~50 chars after
  };
}

export interface SemanticSegment {
  content: string;
  startPosition: number;
  endPosition: number;
  topic?: string;
  keywords: string[];
  coherenceScore: number;  // How internally coherent the segment is
}

export interface SemanticAnalysis {
  boundaries: SemanticBoundary[];
  segments: SemanticSegment[];
  topicKeywords: string[];
  averageSegmentLength: number;
  totalTopics: number;
}

// Topic transition indicators - words/phrases that signal new topics
const TOPIC_TRANSITION_PATTERNS = [
  // Strong transitions
  { pattern: /\b(however|nevertheless|on the other hand|in contrast|conversely)\b/gi, strength: 0.9, type: 'transition' as const },
  { pattern: /\b(furthermore|moreover|additionally|in addition|also)\b/gi, strength: 0.6, type: 'continuation' as const },
  { pattern: /\b(therefore|thus|consequently|as a result|hence)\b/gi, strength: 0.7, type: 'conclusion' as const },
  { pattern: /\b(for example|for instance|such as|to illustrate|consider)\b/gi, strength: 0.5, type: 'example' as const },
  { pattern: /\b(first(ly)?|second(ly)?|third(ly)?|finally|lastly|next)\b/gi, strength: 0.8, type: 'new_topic' as const },
  { pattern: /\b(moving on|turning to|let's (look at|discuss|talk about)|now|speaking of)\b/gi, strength: 0.9, type: 'new_topic' as const },
  { pattern: /\b(another (aspect|point|thing|topic|issue)|a different)\b/gi, strength: 0.85, type: 'new_topic' as const },
  { pattern: /\b(in (summary|conclusion)|to (summarize|conclude|sum up)|overall)\b/gi, strength: 0.8, type: 'conclusion' as const },
  // Structural markers
  { pattern: /^#+\s+/gm, strength: 1.0, type: 'new_topic' as const },  // Markdown headers
  { pattern: /^(\d+\.|[a-z]\)|\*|\-)\s+/gm, strength: 0.4, type: 'subtopic' as const },  // List items
];

// Question patterns that often start new topics
const QUESTION_PATTERNS = [
  /\b(what|how|why|when|where|who|which|can|should|would|could|is|are|do|does)\b[^.!?]*\?/gi,
];

// Speaker change patterns
const SPEAKER_PATTERNS = [
  /\n\s*(Speaker\s*\d+|[A-Z][a-z]+):\s*/g,
  /\n\s*\[([A-Z][a-z]+|Speaker\s*\d+)\]\s*/g,
];

// Time jump patterns (for timestamped content)
const TIME_JUMP_THRESHOLD = 30; // seconds - bigger gap suggests topic change

// Stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
  'need', 'this', 'that', 'these', 'those', 'it', 'its', 'i', 'you', 'he', 'she', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'just', 'now', 'here', 'there', 'then', 'if', 'because',
  'as', 'until', 'while', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further',
  'once', 'really', 'going', 'thing', 'things', 'like', 'know', 'think', 'want', 'look', 'use',
  'find', 'give', 'tell', 'try', 'leave', 'call', 'keep', 'let', 'put', 'seem', 'help', 'show',
  'hear', 'play', 'run', 'move', 'live', 'believe', 'bring', 'happen', 'write', 'provide'
]);

/**
 * Extract significant keywords from text for topic detection
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
  
  // Count word frequencies
  const freq = new Map<string, number>();
  words.forEach(word => {
    freq.set(word, (freq.get(word) || 0) + 1);
  });
  
  // Sort by frequency and return top keywords
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Calculate semantic similarity between two text segments using keyword overlap
 */
export function calculateTopicSimilarity(text1: string, text2: string): number {
  const keywords1 = new Set(extractKeywords(text1, 15));
  const keywords2 = new Set(extractKeywords(text2, 15));
  
  if (keywords1.size === 0 || keywords2.size === 0) return 0;
  
  let intersection = 0;
  keywords1.forEach(k => {
    if (keywords2.has(k)) intersection++;
  });
  
  // Jaccard similarity
  const union = keywords1.size + keywords2.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Detect topic transition signals in text
 */
export function detectTopicSignals(text: string): TopicSignal[] {
  const signals: TopicSignal[] = [];
  
  // Check each transition pattern
  for (const { pattern, strength, type } of TOPIC_TRANSITION_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      signals.push({
        type,
        strength,
        position: match.index,
        reason: `Found "${match[0]}" (${type})`,
      });
    }
  }
  
  // Check for questions (often introduce new topics)
  for (const pattern of QUESTION_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      signals.push({
        type: 'new_topic',
        strength: 0.5,
        position: match.index,
        reason: `Question detected: "${match[0].slice(0, 50)}..."`,
      });
    }
  }
  
  return signals.sort((a, b) => a.position - b.position);
}

/**
 * Find semantic boundaries in content
 */
export function findSemanticBoundaries(
  content: string,
  options: {
    minSegmentLength?: number;
    maxBoundaries?: number;
    includeStructural?: boolean;
  } = {}
): SemanticBoundary[] {
  const {
    minSegmentLength = 100,
    maxBoundaries = 50,
    includeStructural = true,
  } = options;
  
  const boundaries: SemanticBoundary[] = [];
  const lines = content.split('\n');
  let charOffset = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineStart = charOffset;
    charOffset += line.length + 1; // +1 for newline
    
    // Skip very short lines
    if (trimmed.length < 10) continue;
    
    let boundaryScore = 0;
    let boundaryType: SemanticBoundary['type'] = 'paragraph';
    
    // Check for structural boundaries
    if (includeStructural) {
      // Markdown headers
      if (/^#{1,6}\s+/.test(trimmed)) {
        boundaryScore = 0.95;
        boundaryType = 'section_break';
      }
      // All-caps headers
      else if (/^[A-Z][A-Z\s]{5,}$/.test(trimmed)) {
        boundaryScore = 0.85;
        boundaryType = 'section_break';
      }
      // Numbered sections
      else if (/^(\d+\.|\([a-z]\))\s+[A-Z]/.test(trimmed)) {
        boundaryScore = 0.7;
        boundaryType = 'section_break';
      }
    }
    
    // Check for speaker changes
    for (const pattern of SPEAKER_PATTERNS) {
      if (pattern.test('\n' + line)) {
        boundaryScore = Math.max(boundaryScore, 0.8);
        boundaryType = 'speaker_change';
        break;
      }
    }
    
    // Check for topic transitions at line start
    const signals = detectTopicSignals(trimmed.slice(0, 50));
    if (signals.length > 0 && signals[0].position < 20) {
      const signal = signals[0];
      if (signal.type === 'new_topic' || signal.type === 'transition') {
        boundaryScore = Math.max(boundaryScore, signal.strength * 0.9);
        boundaryType = 'topic_shift';
      }
    }
    
    // Check for paragraph breaks (preceded by empty line)
    if (i > 0 && lines[i - 1].trim() === '' && boundaryScore < 0.3) {
      boundaryScore = 0.3;
      boundaryType = 'paragraph';
    }
    
    // Add boundary if significant
    if (boundaryScore > 0.2) {
      const beforeStart = Math.max(0, lineStart - 50);
      const afterEnd = Math.min(content.length, charOffset + 50);
      
      boundaries.push({
        position: lineStart,
        lineIndex: i,
        score: boundaryScore,
        type: boundaryType,
        context: {
          beforeText: content.slice(beforeStart, lineStart).trim(),
          afterText: content.slice(lineStart, afterEnd).trim(),
        },
      });
    }
  }
  
  // Sort by score and limit
  return boundaries
    .sort((a, b) => b.score - a.score)
    .slice(0, maxBoundaries)
    .sort((a, b) => a.position - b.position);
}

/**
 * Segment content based on semantic boundaries
 */
export function segmentBySemantics(
  content: string,
  options: {
    minSegmentTokens?: number;
    maxSegmentTokens?: number;
    targetSegmentTokens?: number;
  } = {}
): SemanticSegment[] {
  const {
    minSegmentTokens = 50,
    maxSegmentTokens = 1500,
    targetSegmentTokens = 800,
  } = options;
  
  // Estimate tokens (rough: 4 chars per token)
  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  
  const boundaries = findSemanticBoundaries(content, {
    includeStructural: true,
    maxBoundaries: 100,
  });
  
  const segments: SemanticSegment[] = [];
  let lastEnd = 0;
  let currentSegmentStart = 0;
  let currentContent = '';
  
  // Process boundaries to create segments
  for (const boundary of boundaries) {
    const textBefore = content.slice(lastEnd, boundary.position);
    currentContent += textBefore;
    
    const currentTokens = estimateTokens(currentContent);
    
    // Decide whether to split here
    const shouldSplit = (
      // Strong boundary and we have enough content
      (boundary.score >= 0.7 && currentTokens >= minSegmentTokens) ||
      // Medium boundary and we're near target size
      (boundary.score >= 0.4 && currentTokens >= targetSegmentTokens * 0.7) ||
      // Any boundary and we're over target
      (boundary.score >= 0.2 && currentTokens >= targetSegmentTokens) ||
      // Approaching max size - must split
      currentTokens >= maxSegmentTokens * 0.9
    );
    
    if (shouldSplit && currentContent.trim().length > 0) {
      const keywords = extractKeywords(currentContent, 5);
      segments.push({
        content: currentContent.trim(),
        startPosition: currentSegmentStart,
        endPosition: boundary.position,
        keywords,
        coherenceScore: calculateCoherence(currentContent),
      });
      
      currentSegmentStart = boundary.position;
      currentContent = '';
    }
    
    lastEnd = boundary.position;
  }
  
  // Add remaining content
  const remaining = content.slice(lastEnd);
  currentContent += remaining;
  
  if (currentContent.trim().length > 0) {
    const keywords = extractKeywords(currentContent, 5);
    segments.push({
      content: currentContent.trim(),
      startPosition: currentSegmentStart,
      endPosition: content.length,
      keywords,
      coherenceScore: calculateCoherence(currentContent),
    });
  }
  
  // Post-process: merge very small segments
  return mergeSmallSegments(segments, minSegmentTokens);
}

/**
 * Calculate internal coherence of a text segment
 */
function calculateCoherence(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length < 2) return 1.0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  // Compare adjacent sentences
  for (let i = 0; i < sentences.length - 1; i++) {
    const similarity = calculateTopicSimilarity(sentences[i], sentences[i + 1]);
    totalSimilarity += similarity;
    comparisons++;
  }
  
  return comparisons > 0 ? totalSimilarity / comparisons : 0.5;
}

/**
 * Merge segments that are too small
 */
function mergeSmallSegments(segments: SemanticSegment[], minTokens: number): SemanticSegment[] {
  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  const merged: SemanticSegment[] = [];
  
  let current: SemanticSegment | null = null;
  
  for (const segment of segments) {
    if (!current) {
      current = { ...segment };
      continue;
    }
    
    const currentTokens = estimateTokens(current.content);
    const segmentTokens = estimateTokens(segment.content);
    
    // Merge if current is too small
    if (currentTokens < minTokens) {
      current.content += '\n\n' + segment.content;
      current.endPosition = segment.endPosition;
      current.keywords = [...new Set([...current.keywords, ...segment.keywords])].slice(0, 8);
      current.coherenceScore = (current.coherenceScore + segment.coherenceScore) / 2;
    } else {
      merged.push(current);
      current = { ...segment };
    }
  }
  
  if (current) {
    merged.push(current);
  }
  
  return merged;
}

/**
 * Perform full semantic analysis on content
 */
export function analyzeSemantics(content: string): SemanticAnalysis {
  const boundaries = findSemanticBoundaries(content);
  const segments = segmentBySemantics(content);
  const topicKeywords = extractKeywords(content, 15);
  
  return {
    boundaries,
    segments,
    topicKeywords,
    averageSegmentLength: segments.length > 0 
      ? segments.reduce((sum, s) => sum + s.content.length, 0) / segments.length 
      : 0,
    totalTopics: segments.length,
  };
}

/**
 * Find optimal split points within a text segment
 * Returns positions where it's best to split, prioritized by score
 */
export function findOptimalSplitPoints(
  text: string,
  targetChunkTokens: number = 800,
  options: {
    allowMidParagraph?: boolean;
    preferSentenceBoundary?: boolean;
  } = {}
): number[] {
  const {
    allowMidParagraph = false,
    preferSentenceBoundary = true,
  } = options;
  
  const estimateTokens = (t: string) => Math.ceil(t.length / 4);
  const totalTokens = estimateTokens(text);
  
  if (totalTokens <= targetChunkTokens) {
    return []; // No split needed
  }
  
  // Get semantic boundaries
  const boundaries = findSemanticBoundaries(text);
  
  // Calculate expected number of chunks
  const expectedChunks = Math.ceil(totalTokens / targetChunkTokens);
  const idealChunkSize = text.length / expectedChunks;
  
  // Score each boundary based on position and semantic strength
  const scoredPositions = boundaries.map(b => {
    // How close is this to an ideal split point?
    const nearestIdealSplit = Math.round(b.position / idealChunkSize) * idealChunkSize;
    const distanceFromIdeal = Math.abs(b.position - nearestIdealSplit) / idealChunkSize;
    const positionScore = 1 - Math.min(distanceFromIdeal, 1);
    
    // Combine with semantic score
    const combinedScore = (b.score * 0.6) + (positionScore * 0.4);
    
    return {
      position: b.position,
      score: combinedScore,
      type: b.type,
    };
  });
  
  // Add sentence boundaries if semantic boundaries are sparse
  if (preferSentenceBoundary && scoredPositions.length < expectedChunks * 2) {
    const sentenceEnds = [...text.matchAll(/[.!?]\s+/g)];
    for (const match of sentenceEnds) {
      const pos = match.index! + match[0].length;
      // Only add if not too close to existing boundaries
      const tooClose = scoredPositions.some(sp => Math.abs(sp.position - pos) < 100);
      if (!tooClose) {
        scoredPositions.push({
          position: pos,
          score: 0.3,
          type: 'paragraph',
        });
      }
    }
  }
  
  // Sort by score and select best split points
  scoredPositions.sort((a, b) => b.score - a.score);
  
  const selectedPositions: number[] = [];
  let lastSelected = 0;
  
  for (const sp of scoredPositions) {
    // Ensure reasonable distance from last split
    const tokensSinceLastSplit = estimateTokens(text.slice(lastSelected, sp.position));
    
    if (tokensSinceLastSplit >= targetChunkTokens * 0.5) {
      selectedPositions.push(sp.position);
      lastSelected = sp.position;
      
      if (selectedPositions.length >= expectedChunks - 1) {
        break;
      }
    }
  }
  
  return selectedPositions.sort((a, b) => a - b);
}

/**
 * Detect time-based topic boundaries for timestamped content
 */
export function detectTimeBasedBoundaries(
  segments: Array<{ startTime: number; endTime: number; text: string }>,
  options: {
    gapThreshold?: number;
    topicShiftThreshold?: number;
  } = {}
): SemanticBoundary[] {
  const {
    gapThreshold = TIME_JUMP_THRESHOLD,
    topicShiftThreshold = 0.3,
  } = options;
  
  const boundaries: SemanticBoundary[] = [];
  
  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];
    
    const timeGap = curr.startTime - prev.endTime;
    const topicSimilarity = calculateTopicSimilarity(prev.text, curr.text);
    
    let score = 0;
    let type: SemanticBoundary['type'] = 'paragraph';
    
    // Large time gap suggests topic change
    if (timeGap >= gapThreshold) {
      score = Math.min(0.5 + (timeGap / 120) * 0.5, 1.0); // Scale by gap size
      type = 'time_jump';
    }
    
    // Low topic similarity suggests topic change
    if (topicSimilarity < topicShiftThreshold) {
      score = Math.max(score, 0.7 - topicSimilarity);
      type = 'topic_shift';
    }
    
    // Check for transition phrases
    const currSignals = detectTopicSignals(curr.text.slice(0, 100));
    if (currSignals.some(s => s.type === 'new_topic' || s.type === 'transition')) {
      score = Math.max(score, 0.8);
      type = 'topic_shift';
    }
    
    if (score > 0.3) {
      boundaries.push({
        position: i,
        lineIndex: i,
        score,
        type,
        context: {
          beforeText: prev.text.slice(-50),
          afterText: curr.text.slice(0, 50),
        },
      });
    }
  }
  
  return boundaries;
}
