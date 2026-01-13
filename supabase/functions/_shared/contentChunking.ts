// Shared content chunking utilities for edge functions
// Optimized for AI context handling with large documents

export interface ChunkOptions {
  maxChunkSize?: number;
  overlapSize?: number;
  preserveStructure?: boolean;
  prioritizeRelevance?: boolean;
}

export interface ContentChunk {
  id: string;
  content: string;
  index: number;
  startOffset: number;
  endOffset: number;
  relevanceScore: number;
  metadata: {
    hasHeadings: boolean;
    hasLists: boolean;
    hasCode: boolean;
    hasMath: boolean;
    wordCount: number;
    keyTerms: string[];
  };
}

export interface ChunkedContent {
  chunks: ContentChunk[];
  summary: string;
  totalLength: number;
  optimalContextWindow: number;
  keyTopics: string[];
}

// Default chunking configuration
const DEFAULT_OPTIONS: ChunkOptions = {
  maxChunkSize: 3000,
  overlapSize: 200,
  preserveStructure: true,
  prioritizeRelevance: true,
};

// Important keywords that boost chunk relevance
const IMPORTANCE_KEYWORDS = [
  'definition', 'formula', 'equation', 'theorem', 'principle', 'concept',
  'example', 'solution', 'answer', 'conclusion', 'summary', 'key point',
  'important', 'note', 'remember', 'crucial', 'essential', 'fundamental',
  'chapter', 'section', 'overview', 'introduction', 'abstract', 'result'
];

// Question-related keywords
const QUESTION_KEYWORDS = [
  'what', 'how', 'why', 'when', 'where', 'which', 'who', 'question', 'problem', 'explain'
];

/**
 * Smart content chunking with overlap and relevance scoring
 */
export function chunkContent(
  content: string,
  contentType: string,
  options: ChunkOptions = {}
): ChunkedContent {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Select chunking strategy based on content type
  let chunks: ContentChunk[];
  
  switch (contentType.toLowerCase()) {
    case 'pdf':
      chunks = chunkPDFContent(content, opts);
      break;
    case 'youtube':
    case 'video':
      chunks = chunkVideoContent(content, opts);
      break;
    case 'audio':
      chunks = chunkAudioContent(content, opts);
      break;
    case 'website':
      chunks = chunkWebsiteContent(content, opts);
      break;
    default:
      chunks = chunkTextContent(content, opts);
  }
  
  // Sort by relevance if prioritization is enabled
  if (opts.prioritizeRelevance) {
    chunks.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  // Extract key topics from high-relevance chunks
  const keyTopics = extractKeyTopics(chunks.slice(0, 5));
  
  // Generate quick summary from top chunks
  const summary = generateQuickSummary(chunks);
  
  // Calculate optimal context window
  const optimalContextWindow = calculateOptimalContext(chunks, contentType);
  
  return {
    chunks,
    summary,
    totalLength: content.length,
    optimalContextWindow,
    keyTopics,
  };
}

/**
 * PDF-specific chunking - respects page breaks and sections
 */
function chunkPDFContent(content: string, opts: ChunkOptions): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  
  // Split by page markers first (Page X, --- Page X ---, or standalone numbers)
  const pagePattern = new RegExp('(?:Page\\s+\\d+|---\\s*Page\\s*\\d+\\s*---|^\\s*\\d+\\s*$)', 'gm');
  const pages = content.split(pagePattern).filter((p: string) => p.trim().length > 50);
  
  if (pages.length > 1) {
    // Process page by page
    let globalOffset = 0;
    pages.forEach((page, pageIndex) => {
      const pageChunks = chunkByStructure(page, opts, `pdf_p${pageIndex + 1}`, globalOffset);
      chunks.push(...pageChunks);
      globalOffset += page.length;
    });
  } else {
    // No page markers, use structural chunking
    chunks.push(...chunkByStructure(content, opts, 'pdf', 0));
  }
  
  return addOverlap(chunks, opts.overlapSize || 0);
}

/**
 * Video/YouTube content chunking - respects timestamps
 */
function chunkVideoContent(content: string, opts: ChunkOptions): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  
  // Split by timestamp patterns [00:00], (00:00), 00:00 -
  const timestampPattern = /(?:\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*[-:]?\s*)/g;
  const segments = content.split(timestampPattern).filter(s => s.trim().length > 20);
  
  let currentChunk = '';
  let chunkIndex = 0;
  let startOffset = 0;
  
  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;
    
    if (currentChunk.length + trimmed.length > (opts.maxChunkSize || 3000)) {
      if (currentChunk) {
        chunks.push(createChunk(currentChunk, `video_${chunkIndex}`, chunkIndex, startOffset, 'video'));
        chunkIndex++;
        startOffset += currentChunk.length;
      }
      currentChunk = trimmed;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmed;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(createChunk(currentChunk, `video_${chunkIndex}`, chunkIndex, startOffset, 'video'));
  }
  
  return addOverlap(chunks, opts.overlapSize || 0);
}

/**
 * Audio content chunking - respects speaker patterns and pauses
 */
function chunkAudioContent(content: string, opts: ChunkOptions): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  
  // Look for speaker indicators or pause markers
  const speakerPattern = /(?:Speaker\s*\d+|[A-Z][a-z]+:|^\s*[-•]\s*)/gm;
  const segments = content.split(speakerPattern).filter(s => s.trim().length > 30);
  
  let currentChunk = '';
  let chunkIndex = 0;
  let startOffset = 0;
  
  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;
    
    if (currentChunk.length + trimmed.length > (opts.maxChunkSize || 3000)) {
      if (currentChunk) {
        chunks.push(createChunk(currentChunk, `audio_${chunkIndex}`, chunkIndex, startOffset, 'audio'));
        chunkIndex++;
        startOffset += currentChunk.length;
      }
      currentChunk = trimmed;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + trimmed;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(createChunk(currentChunk, `audio_${chunkIndex}`, chunkIndex, startOffset, 'audio'));
  }
  
  return addOverlap(chunks, opts.overlapSize || 0);
}

/**
 * Website content chunking - respects HTML structure
 */
function chunkWebsiteContent(content: string, opts: ChunkOptions): ContentChunk[] {
  // Clean HTML but preserve structure markers
  let cleanContent = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '\n---SECTION---\n')
    .replace(/<section[^>]*>/gi, '\n---SECTION---\n')
    .replace(/<article[^>]*>/gi, '\n---SECTION---\n')
    .replace(/<h[1-6][^>]*>/gi, '\n## ')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split by section markers
  const sections = cleanContent.split(/---SECTION---/).filter(s => s.trim().length > 50);
  
  const chunks: ContentChunk[] = [];
  let chunkIndex = 0;
  let startOffset = 0;
  
  for (const section of sections) {
    const sectionChunks = chunkByStructure(section.trim(), opts, `web_${chunkIndex}`, startOffset);
    chunks.push(...sectionChunks);
    chunkIndex += sectionChunks.length;
    startOffset += section.length;
  }
  
  return addOverlap(chunks, opts.overlapSize || 0);
}

/**
 * Generic text content chunking - sentence-aware
 */
function chunkTextContent(content: string, opts: ChunkOptions): ContentChunk[] {
  return chunkByStructure(content, opts, 'text', 0);
}

/**
 * Structure-aware chunking helper
 */
function chunkByStructure(
  content: string,
  opts: ChunkOptions,
  prefix: string,
  globalOffset: number
): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const maxSize = opts.maxChunkSize || 3000;
  
  // Split by paragraphs first (double newlines)
  const paragraphs = content.split(/\n\s*\n/);
  
  let currentChunk = '';
  let chunkIndex = 0;
  let localOffset = 0;
  
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    
    // Check if this paragraph contains a heading (potential section break)
    const isHeading = /^#{1,6}\s/.test(trimmed) || /^[A-Z][A-Z\s]{5,}$/.test(trimmed.split('\n')[0]);
    
    // Start new chunk on heading if current chunk is reasonably sized
    if (isHeading && currentChunk.length > maxSize * 0.3) {
      chunks.push(createChunk(currentChunk, `${prefix}_${chunkIndex}`, chunkIndex, globalOffset + localOffset, prefix.split('_')[0]));
      localOffset += currentChunk.length;
      chunkIndex++;
      currentChunk = trimmed;
    } else if (currentChunk.length + trimmed.length > maxSize) {
      // Current chunk is full
      if (currentChunk) {
        chunks.push(createChunk(currentChunk, `${prefix}_${chunkIndex}`, chunkIndex, globalOffset + localOffset, prefix.split('_')[0]));
        localOffset += currentChunk.length;
        chunkIndex++;
      }
      
      // Handle very long paragraphs
      if (trimmed.length > maxSize) {
        const sentenceChunks = chunkBySentences(trimmed, maxSize, prefix, chunkIndex, globalOffset + localOffset);
        chunks.push(...sentenceChunks);
        chunkIndex += sentenceChunks.length;
        localOffset += trimmed.length;
        currentChunk = '';
      } else {
        currentChunk = trimmed;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
    }
  }
  
  // Add remaining content
  if (currentChunk.trim()) {
    chunks.push(createChunk(currentChunk, `${prefix}_${chunkIndex}`, chunkIndex, globalOffset + localOffset, prefix.split('_')[0]));
  }
  
  return chunks;
}

/**
 * Sentence-level chunking for very long paragraphs
 */
function chunkBySentences(
  text: string,
  maxSize: number,
  prefix: string,
  startIndex: number,
  startOffset: number
): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  let currentChunk = '';
  let chunkIndex = startIndex;
  let localOffset = 0;
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxSize && currentChunk) {
      chunks.push(createChunk(currentChunk, `${prefix}_${chunkIndex}`, chunkIndex, startOffset + localOffset, prefix.split('_')[0]));
      localOffset += currentChunk.length;
      chunkIndex++;
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(createChunk(currentChunk, `${prefix}_${chunkIndex}`, chunkIndex, startOffset + localOffset, prefix.split('_')[0]));
  }
  
  return chunks;
}

/**
 * Create a content chunk with metadata
 */
function createChunk(
  content: string,
  id: string,
  index: number,
  startOffset: number,
  contentType: string
): ContentChunk {
  const trimmedContent = content.trim();
  const contentLower = trimmedContent.toLowerCase();
  
  // Analyze content characteristics
  const hasHeadings = /^#{1,6}\s|^[A-Z][A-Z\s]{5,}$/m.test(trimmedContent);
  const hasLists = /^[-*•]\s|^\d+\.\s/m.test(trimmedContent);
  const hasCode = /```[\s\S]*?```|`[^`]+`/.test(trimmedContent);
  const hasMath = /\$[\s\S]*?\$|\\[a-zA-Z]+{/.test(trimmedContent);
  
  // Calculate word count
  const words = trimmedContent.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Extract key terms (most frequent meaningful words)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that', 'these', 'those', 'it', 'its']);
  
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length > 3 && !stopWords.has(clean)) {
      wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1);
    }
  });
  
  const keyTerms = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
  
  // Calculate relevance score
  let relevanceScore = 0.5;
  
  // Boost for important keywords
  IMPORTANCE_KEYWORDS.forEach(keyword => {
    if (contentLower.includes(keyword)) relevanceScore += 0.08;
  });
  
  // Boost for question-related content
  QUESTION_KEYWORDS.forEach(keyword => {
    if (contentLower.includes(keyword)) relevanceScore += 0.04;
  });
  
  // Boost for structural elements
  if (hasHeadings) relevanceScore += 0.1;
  if (hasLists) relevanceScore += 0.05;
  if (hasCode) relevanceScore += 0.05;
  if (hasMath) relevanceScore += 0.1;
  
  // Penalize very short or very long chunks
  if (wordCount < 30) relevanceScore -= 0.15;
  else if (wordCount < 50) relevanceScore -= 0.05;
  if (wordCount > 800) relevanceScore -= 0.05;
  
  // Content type specific boosts
  if (contentType === 'pdf' && hasHeadings) relevanceScore += 0.05;
  if ((contentType === 'video' || contentType === 'audio') && /\d{1,2}:\d{2}/.test(trimmedContent)) relevanceScore += 0.05;
  
  return {
    id,
    content: trimmedContent,
    index,
    startOffset,
    endOffset: startOffset + trimmedContent.length,
    relevanceScore: Math.max(0, Math.min(1, relevanceScore)),
    metadata: {
      hasHeadings,
      hasLists,
      hasCode,
      hasMath,
      wordCount,
      keyTerms,
    },
  };
}

/**
 * Add overlap between chunks for better context continuity
 */
function addOverlap(chunks: ContentChunk[], overlapSize: number): ContentChunk[] {
  if (overlapSize <= 0 || chunks.length <= 1) return chunks;
  
  return chunks.map((chunk, index) => {
    if (index === 0) return chunk;
    
    const prevChunk = chunks[index - 1];
    const overlapContent = prevChunk.content.slice(-overlapSize);
    
    // Find a clean break point (sentence or paragraph)
    const cleanBreak = overlapContent.lastIndexOf('. ');
    const overlap = cleanBreak > 0 ? overlapContent.slice(cleanBreak + 2) : overlapContent;
    
    return {
      ...chunk,
      content: `[...] ${overlap}\n\n${chunk.content}`,
    };
  });
}

/**
 * Extract key topics from high-relevance chunks
 */
function extractKeyTopics(topChunks: ContentChunk[]): string[] {
  const allTerms = new Map<string, number>();
  
  topChunks.forEach(chunk => {
    chunk.metadata.keyTerms.forEach((term, index) => {
      // Weight by position (earlier terms are more important)
      const weight = (chunk.metadata.keyTerms.length - index) * chunk.relevanceScore;
      allTerms.set(term, (allTerms.get(term) || 0) + weight);
    });
  });
  
  return Array.from(allTerms.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term]) => term);
}

/**
 * Generate a quick summary from top chunks
 */
function generateQuickSummary(chunks: ContentChunk[]): string {
  const topChunks = chunks
    .slice()
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
  
  // Extract first meaningful sentence from each top chunk
  const summaryParts = topChunks.map(chunk => {
    const sentences = chunk.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences[0]?.trim() || '';
  }).filter(s => s.length > 0);
  
  return summaryParts.join('. ') + (summaryParts.length > 0 ? '.' : '');
}

/**
 * Calculate optimal context window size based on content
 */
function calculateOptimalContext(chunks: ContentChunk[], contentType: string): number {
  const totalWords = chunks.reduce((sum, chunk) => sum + chunk.metadata.wordCount, 0);
  
  // Base context sizes by content type
  const baseContexts: Record<string, number> = {
    pdf: 12000,
    youtube: 10000,
    video: 10000,
    audio: 8000,
    website: 10000,
    text: 10000,
  };
  
  const baseContext = baseContexts[contentType.toLowerCase()] || 10000;
  
  // Adjust based on content length
  if (totalWords < 1000) return Math.min(baseContext, totalWords * 4);
  if (totalWords > 10000) return Math.min(baseContext * 1.5, 20000);
  
  return baseContext;
}

/**
 * Select optimal chunks for AI context within token limit
 */
export function selectChunksForContext(
  chunkedContent: ChunkedContent,
  maxTokens: number = 10000,
  includeOverview: boolean = true
): string {
  const avgCharsPerToken = 4;
  const maxChars = maxTokens * avgCharsPerToken;
  
  let result = '';
  
  // Add overview if requested
  if (includeOverview && chunkedContent.summary) {
    result += `**Overview:** ${chunkedContent.summary}\n\n`;
    result += `**Key Topics:** ${chunkedContent.keyTopics.join(', ')}\n\n`;
    result += `---\n\n`;
  }
  
  // Add chunks by relevance until we hit the limit
  const sortedChunks = chunkedContent.chunks
    .slice()
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  for (const chunk of sortedChunks) {
    const chunkText = `[Section ${chunk.index + 1}]\n${chunk.content}\n\n`;
    
    if (result.length + chunkText.length <= maxChars) {
      result += chunkText;
    } else if (result.length < maxChars * 0.5) {
      // If we haven't used half the budget, add truncated chunk
      const remaining = maxChars - result.length - 100;
      result += `[Section ${chunk.index + 1}]\n${chunk.content.slice(0, remaining)}...\n\n`;
      break;
    } else {
      break;
    }
  }
  
  return result.trim();
}

/**
 * Create paginated chunk view for large documents
 */
export function getChunkPage(
  chunkedContent: ChunkedContent,
  page: number,
  chunksPerPage: number = 5
): { chunks: ContentChunk[]; totalPages: number; currentPage: number } {
  const startIndex = (page - 1) * chunksPerPage;
  const totalPages = Math.ceil(chunkedContent.chunks.length / chunksPerPage);
  
  return {
    chunks: chunkedContent.chunks.slice(startIndex, startIndex + chunksPerPage),
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
}
