// Content processing utilities for enhanced AI understanding

export interface ContentChunk {
  id: string;
  content: string;
  type: 'text' | 'summary' | 'key_points' | 'metadata';
  relevanceScore: number;
  sourceType: string;
  chunkIndex: number;
  totalChunks: number;
}

export interface ProcessedContent {
  summary: string;
  keyPoints: string[];
  chunks: ContentChunk[];
  metadata: {
    originalLength: number;
    processedLength: number;
    compressionRatio: number;
    contentType: string;
  };
}

// Smart chunking strategy based on content type
export function createSmartChunks(
  content: string, 
  contentType: string, 
  maxChunkSize: number = 2000
): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  
  switch (contentType.toLowerCase()) {
    case 'pdf':
    case 'document':
      return chunkDocument(content, maxChunkSize);
    
    case 'youtube':
    case 'video':
      return chunkVideo(content, maxChunkSize);
    
    case 'audio':
      return chunkAudio(content, maxChunkSize);
    
    case 'website':
      return chunkWebsite(content, maxChunkSize);
    
    case 'text':
    default:
      return chunkText(content, maxChunkSize);
  }
}

// Document-specific chunking (respects paragraphs and sections)
function chunkDocument(content: string, maxChunkSize: number): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  
  // Split by double newlines (paragraphs) first
  const paragraphs = content.split(/\n\s*\n/);
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `doc_chunk_${chunkIndex}`,
        content: currentChunk.trim(),
        type: 'text',
        relevanceScore: calculateRelevanceScore(currentChunk, 'document'),
        sourceType: 'document',
        chunkIndex,
        totalChunks: 0 // Will be updated after processing
      });
      currentChunk = paragraph;
      chunkIndex++;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  // Add the last chunk
  if (currentChunk.trim()) {
    chunks.push({
      id: `doc_chunk_${chunkIndex}`,
      content: currentChunk.trim(),
      type: 'text',
      relevanceScore: calculateRelevanceScore(currentChunk, 'document'),
      sourceType: 'document',
      chunkIndex,
      totalChunks: 0
    });
  }
  
  // Update total chunks count
  chunks.forEach(chunk => chunk.totalChunks = chunks.length);
  
  return chunks;
}

// Video/YouTube content chunking (respects timestamps and topics)
function chunkVideo(content: string, maxChunkSize: number): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  
  // Look for timestamp patterns (00:00, [00:00], etc.)
  const timestampRegex = /(?:\[?\d{1,2}:\d{2}(?::\d{2})?\]?)/g;
  const segments = content.split(timestampRegex);
  
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    if (!segment) continue;
    
    if (currentChunk.length + segment.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `video_chunk_${chunkIndex}`,
        content: currentChunk.trim(),
        type: 'text',
        relevanceScore: calculateRelevanceScore(currentChunk, 'video'),
        sourceType: 'video',
        chunkIndex,
        totalChunks: 0
      });
      currentChunk = segment;
      chunkIndex++;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + segment;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push({
      id: `video_chunk_${chunkIndex}`,
      content: currentChunk.trim(),
      type: 'text',
      relevanceScore: calculateRelevanceScore(currentChunk, 'video'),
      sourceType: 'video',
      chunkIndex,
      totalChunks: 0
    });
  }
  
  chunks.forEach(chunk => chunk.totalChunks = chunks.length);
  return chunks;
}

// Audio content chunking (similar to video but focuses on speech patterns)
function chunkAudio(content: string, maxChunkSize: number): ContentChunk[] {
  // Similar to video but with different relevance scoring
  const chunks = chunkText(content, maxChunkSize);
  return chunks.map((chunk, index) => ({
    ...chunk,
    id: `audio_chunk_${index}`,
    sourceType: 'audio',
    relevanceScore: calculateRelevanceScore(chunk.content, 'audio')
  }));
}

// Website content chunking (respects HTML structure)
function chunkWebsite(content: string, maxChunkSize: number): ContentChunk[] {
  // Remove HTML tags and split by sections
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const chunks = chunkText(cleanContent, maxChunkSize);
  
  return chunks.map((chunk, index) => ({
    ...chunk,
    id: `web_chunk_${index}`,
    sourceType: 'website',
    relevanceScore: calculateRelevanceScore(chunk.content, 'website')
  }));
}

// Basic text chunking with sentence boundaries
function chunkText(content: string, maxChunkSize: number): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const sentences = content.split(/[.!?]+/);
  
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;
    
    if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `text_chunk_${chunkIndex}`,
        content: currentChunk.trim(),
        type: 'text',
        relevanceScore: calculateRelevanceScore(currentChunk, 'text'),
        sourceType: 'text',
        chunkIndex,
        totalChunks: 0
      });
      currentChunk = trimmedSentence;
      chunkIndex++;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push({
      id: `text_chunk_${chunkIndex}`,
      content: currentChunk.trim(),
      type: 'text',
      relevanceScore: calculateRelevanceScore(currentChunk, 'text'),
      sourceType: 'text',
      chunkIndex,
      totalChunks: 0
    });
  }
  
  chunks.forEach(chunk => chunk.totalChunks = chunks.length);
  return chunks;
}

// Calculate relevance score based on content characteristics
function calculateRelevanceScore(content: string, contentType: string): number {
  let score = 0.5; // Base score
  
  // Keywords that indicate important content
  const importantKeywords = [
    'definition', 'formula', 'equation', 'theorem', 'principle', 'concept',
    'example', 'solution', 'answer', 'conclusion', 'summary', 'key point',
    'important', 'note', 'remember', 'crucial', 'essential', 'fundamental'
  ];
  
  const questionKeywords = [
    'what', 'how', 'why', 'when', 'where', 'which', 'who', 'question', 'problem'
  ];
  
  const contentLower = content.toLowerCase();
  
  // Boost score for important keywords
  importantKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      score += 0.1;
    }
  });
  
  // Boost score for question-related content
  questionKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      score += 0.05;
    }
  });
  
  // Content type specific scoring
  switch (contentType) {
    case 'document':
      // Boost headings and bullet points
      if (content.match(/^[A-Z][^.]*:/) || content.includes('•') || content.includes('-')) {
        score += 0.1;
      }
      break;
    
    case 'video':
    case 'audio':
      // Boost content with timestamps or speaker indicators
      if (content.match(/\d{1,2}:\d{2}/) || content.includes('speaker') || content.includes('[') || content.includes(']')) {
        score += 0.1;
      }
      break;
  }
  
  // Penalize very short or very long chunks
  if (content.length < 100) {
    score -= 0.1;
  } else if (content.length > 1500) {
    score -= 0.05;
  }
  
  return Math.max(0, Math.min(1, score));
}

// Content summarization for context window management
export function createContentSummary(chunks: ContentChunk[], maxSummaryLength: number = 500): string {
  // Sort chunks by relevance score
  const sortedChunks = chunks.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Take top chunks that fit within the summary length
  let summary = '';
  const topChunks = [];
  
  for (const chunk of sortedChunks) {
    if (summary.length + chunk.content.length < maxSummaryLength) {
      topChunks.push(chunk);
      summary += (summary ? '\n\n' : '') + chunk.content;
    }
  }
  
  if (topChunks.length === 0 && chunks.length > 0) {
    // If no chunks fit, truncate the highest relevance chunk
    const bestChunk = sortedChunks[0];
    summary = bestChunk.content.substring(0, maxSummaryLength - 3) + '...';
  }
  
  return summary;
}

// Generate content-type specific prompts
export function generateContentTypePrompt(contentType: string): string {
  const prompts = {
    pdf: `When analyzing PDF documents, pay special attention to:
- Structured content like headings, bullet points, and numbered lists
- Figures, tables, and their captions
- Mathematical formulas and equations
- Key terms that may be highlighted or emphasized
- Page numbers and section references that might indicate content organization`,

    youtube: `When analyzing YouTube/video content, focus on:
- Timestamps that indicate topic changes or important moments
- Speaker transitions and different voices
- Visual descriptions if mentioned in transcripts
- Key concepts that are repeated or emphasized
- Examples and demonstrations that are described`,

    audio: `When analyzing audio content, consider:
- Speaker emphasis and tone indicators in transcripts
- Repeated key concepts and phrases
- Questions and answers that indicate important information
- Pauses and transitions that might signal topic changes
- Background context or setting if mentioned`,

    website: `When analyzing website content, look for:
- Navigation structure and page hierarchy
- Headlines and subheadings that organize information
- Links and references to other content
- Interactive elements like forms or buttons mentioned in text
- Date stamps and authorship information`,

    text: `When analyzing plain text content, focus on:
- Paragraph structure and logical flow
- Key terms and concepts that appear frequently
- Examples and case studies
- Conclusions and summary statements
- Questions or problems posed in the text`
  };

  return prompts[contentType.toLowerCase()] || prompts.text;
}

// Multi-modal content extraction hints
export function getMultiModalHints(contentType: string): string {
  const hints = {
    pdf: `This PDF may contain:
- Images, diagrams, and charts that provide visual context
- Tables with structured data
- Mathematical notation and formulas
- Highlighted or annotated text
When answering questions, consider that visual elements may be referenced but not fully captured in the text.`,

    video: `This video content may include:
- Visual demonstrations or examples
- Charts, graphs, or slides shown on screen
- Physical objects or locations being discussed
- Body language and visual cues from speakers
Consider that important information might be conveyed visually.`,

    audio: `This audio content may feature:
- Tone and emphasis that convey importance
- Background sounds or music that set context
- Multiple speakers with different perspectives
- Emotional inflection that adds meaning to words
Pay attention to context clues about the setting and mood.`
  };

  return hints[contentType.toLowerCase()] || '';
}