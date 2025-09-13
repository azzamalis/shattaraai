export interface TextMetadata {
  wordCount: number;
  readingTimeMinutes: number;
  summary: string;
  keywords: string[];
  extractedAt: string;
}

export function extractTextMetadata(text: string): TextMetadata {
  // Word count
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Reading time (average 200 words per minute)
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  
  // Generate summary (first 2-3 sentences)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const summary = sentences.slice(0, 3).join('. ').trim() + (sentences.length > 3 ? '...' : '');
  
  // Extract keywords (simple approach - most frequent meaningful words)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall']);
  
  const wordFreq = new Map();
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
      wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1);
    }
  });
  
  const keywords = Array.from(wordFreq.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
  
  return {
    wordCount,
    readingTimeMinutes,
    summary: summary || 'No summary available',
    keywords,
    extractedAt: new Date().toISOString()
  };
}

export function generateSmartTitle(text: string): string {
  // First try to extract H1 headings from markdown-like content
  const h1Match = text.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // Then try H2 headings
  const h2Match = text.match(/^##\s+(.+)$/m);
  if (h2Match) {
    return h2Match[1].trim();
  }
  
  // Look for title-like patterns at the beginning (standalone lines)
  const titlePatterns = [
    /^([A-Z][^.!?\n]{10,60})$/m,  // Capitalized standalone line
    /^(.{10,60})[.!?]\s*\n\s*\n/, // First sentence followed by blank line
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      const title = match[1].trim();
      if (title.length >= 10 && title.length <= 60) {
        return title;
      }
    }
  }
  
  // Fallback: first 4-6 meaningful words from the first sentence
  const firstSentence = text.split(/[.!?]/)[0];
  const words = firstSentence.trim().split(/\s+/).filter(word => 
    word.length > 2 && /[a-zA-Z]/.test(word)
  );
  
  if (words.length >= 4) {
    const title = words.slice(0, 6).join(' ');
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }
  
  return 'Text Content';
}

export function convertToMarkdown(text: string): string {
  let markdown = text;
  
  // Detect and convert headings based on patterns
  markdown = markdown.replace(/^([A-Z][^.!?\n]{10,60})$/gm, '# $1');
  markdown = markdown.replace(/^([A-Z][^.!?\n]{5,40}):?\s*$/gm, '## $1');
  
  // Convert bullet points and lists
  markdown = markdown.replace(/^[-*•]\s+(.+)$/gm, '- $1');
  markdown = markdown.replace(/^\d+\.\s+(.+)$/gm, '1. $1');
  
  // Convert quotes (lines starting with quotes or indented)
  markdown = markdown.replace(/^["'"']\s*(.+)["'"']?\s*$/gm, '> $1');
  markdown = markdown.replace(/^    (.+)$/gm, '> $1');
  
  // Emphasize text in ALL CAPS (but not full sentences)
  markdown = markdown.replace(/\b([A-Z]{2,15})\b/g, '**$1**');
  
  // Convert URLs to markdown links
  markdown = markdown.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
  
  // Ensure proper paragraph spacing
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  return markdown.trim();
}

export function generateFilename(title: string): string {
  if (title === 'Text Content') {
    return `paste_${Date.now()}.md`;
  }
  
  // Convert title to kebab-case filename
  const kebabTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')        // Remove leading/trailing hyphens
    .substring(0, 50);            // Limit length
  
  return `${kebabTitle || 'text-content'}.md`;
}