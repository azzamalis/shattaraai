import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebsiteExtractorRequest {
  url: string;
  contentId: string;
}

function extractCleanHTML(html: string): string {
  // Remove unwanted elements while preserving content structure
  let cleanedHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    // Remove Wikipedia-specific navigation and structural elements
    .replace(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
    .replace(/<table[^>]*class="[^"]*navbox[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
    .replace(/<table[^>]*class="[^"]*vertical-navbox[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
    .replace(/<table[^>]*class="[^"]*sidebar[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
    .replace(/<div[^>]*class="[^"]*mbox[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*hatnote[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*role="navigation"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*id="toc"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<span[^>]*class="[^"]*mw-editsection[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '')
    // Remove common navigation patterns
    .replace(/<div[^>]*class="[^"]*\bnav\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*\bmenu\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*\bsidebar\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*\bwidget\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*\badvertisement\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*\bad\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Extract main content area (prioritize article, main, or content-rich divs)
  const mainContentMatch = 
    cleanedHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/gi) ||
    cleanedHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/gi) ||
    cleanedHtml.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi) ||
    cleanedHtml.match(/<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/gi) ||
    cleanedHtml.match(/<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);

  if (mainContentMatch && mainContentMatch[0]) {
    cleanedHtml = mainContentMatch[0];
  }

  // Remove reference and citation sections (typically at end of articles)
  cleanedHtml = cleanedHtml
    .replace(/<div[^>]*class="[^"]*reflist[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*references[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<ol[^>]*class="[^"]*references[^"]*"[^>]*>[\s\S]*?<\/ol>/gi, '');

  // Preserve semantic HTML elements
  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'blockquote', 'cite',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'strong', 'b', 'em', 'i', 'u',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'code', 'pre', 'kbd', 'samp'
  ];

  // Remove all tags except allowed ones, but preserve their content
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  cleanedHtml = cleanedHtml.replace(tagRegex, (match, tagName) => {
    const lowerTagName = tagName.toLowerCase();
    
    if (allowedTags.includes(lowerTagName)) {
      // Clean attributes for security, keep only essential ones
      if (lowerTagName === 'a') {
        const hrefMatch = match.match(/href\s*=\s*["']([^"']+)["']/i);
        if (hrefMatch) {
          return match.startsWith('</') ? '</a>' : `<a href="${hrefMatch[1]}" target="_blank" rel="noopener noreferrer">`;
        }
        return match.startsWith('</') ? '</a>' : '<a>';
      } else if (lowerTagName === 'img') {
        const srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i);
        const altMatch = match.match(/alt\s*=\s*["']([^"']+)["']/i);
        if (srcMatch) {
          const altAttr = altMatch ? ` alt="${altMatch[1]}"` : '';
          return `<img src="${srcMatch[1]}"${altAttr}>`;
        }
        return '';
      } else {
        // For other allowed tags, just keep the basic tag
        return match.startsWith('</') ? `</${lowerTagName}>` : `<${lowerTagName}>`;
      }
    }
    
    // Remove disallowed tags but keep content
    return '';
  });

  // Convert citation patterns like [1], [2] into proper reference links
  cleanedHtml = cleanedHtml.replace(/\[(\d+)\]/g, '<a href="#ref-$1" class="citation">[$1]</a>');

  // Decode HTML entities
  cleanedHtml = cleanedHtml
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#91;/g, '[')
    .replace(/&#93;/g, ']');

  // Remove "Jump to:" navigation text and standalone navigation words
  cleanedHtml = cleanedHtml
    .replace(/Jump to:\s*(navigation|search|content)[,\s]*/gi, '')
    .replace(/\b(From Wikipedia, the free encyclopedia)\b/gi, '')
    .replace(/<[^>]*>\s*\b(navigation|search|edit|view history|talk|contributions)\b\s*<\/[^>]*>/gi, '');

  // Clean up excessive whitespace while preserving structure
  cleanedHtml = cleanedHtml
    .replace(/\n\s*\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanedHtml;
}

function extractTextFromHTML(html: string): string {
  // For backwards compatibility, extract plain text from HTML
  const cleanHtml = extractCleanHTML(html);
  
  // Remove remaining HTML tags for plain text version
  let text = cleanHtml.replace(/<[^>]+>/g, ' ');
  
  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return text;
}

function extractHeadings(html: string): Array<{level: number, text: string, id?: string}> {
  const headings = [];
  const headingRegex = /<h([1-6])[^>]*(?:id=['"]([^'"]*)['""])?[^>]*>([^<]*)<\/h[1-6]>/gi;
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2] || '';
    const text = match[3].trim();
    
    if (text && level <= 3) { // Only h1, h2, h3
      headings.push({
        level,
        text: text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        ...(id && { id })
      });
    }
  }
  
  return headings;
}

function extractLinks(html: string, baseUrl: string): Array<{text: string, href: string, internal: boolean}> {
  const links = [];
  const linkRegex = /<a[^>]*href=['"]([^'"]*)['""][^>]*>([^<]*)<\/a>/gi;
  let match;
  
  const baseDomain = new URL(baseUrl).hostname.replace(/^www\./, '');
  
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].trim();
    
    if (href && text && !href.startsWith('#') && !href.startsWith('javascript:')) {
      try {
        let fullUrl = href;
        if (href.startsWith('/')) {
          fullUrl = new URL(href, baseUrl).href;
        } else if (!href.startsWith('http')) {
          fullUrl = new URL(href, baseUrl).href;
        }
        
        const linkDomain = new URL(fullUrl).hostname.replace(/^www\./, '');
        const isInternal = linkDomain === baseDomain;
        
        links.push({
          text: text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          href: fullUrl,
          internal: isInternal
        });
      } catch (e) {
        // Skip invalid URLs
      }
    }
  }
  
  // Remove duplicates
  const uniqueLinks = links.filter((link, index, self) => 
    index === self.findIndex(l => l.href === link.href)
  );
  
  return uniqueLinks.slice(0, 50); // Limit to 50 links
}

function extractMetadata(html: string, url: string): any {
  const metadata: any = { url };

  try {
    const urlObj = new URL(url);
    metadata.domain = urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    metadata.domain = url;
  }

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=['"]*description['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  }

  // Extract author
  const authorMatch = html.match(/<meta[^>]*name=['"]*author['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
  if (authorMatch) {
    metadata.author = authorMatch[1].trim();
  }

  // Extract publication date - try multiple formats
  let publishedDate = null;
  
  // Try article:published_time
  const pubDateMatch1 = html.match(/<meta[^>]*property=['"]*article:published_time['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
  if (pubDateMatch1) {
    publishedDate = pubDateMatch1[1].trim();
  }
  
  // Try datePublished
  if (!publishedDate) {
    const pubDateMatch2 = html.match(/<meta[^>]*property=['"]*datePublished['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    if (pubDateMatch2) {
      publishedDate = pubDateMatch2[1].trim();
    }
  }
  
  // Try name="date"
  if (!publishedDate) {
    const pubDateMatch3 = html.match(/<meta[^>]*name=['"]*date['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    if (pubDateMatch3) {
      publishedDate = pubDateMatch3[1].trim();
    }
  }

  if (publishedDate) {
    metadata.published = publishedDate;
  }

  // Extract Open Graph data
  const ogTitleMatch = html.match(/<meta[^>]*property=['"]*og:title['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
  if (ogTitleMatch) {
    metadata.ogTitle = ogTitleMatch[1].trim();
  }

  const ogDescMatch = html.match(/<meta[^>]*property=['"]*og:description['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
  if (ogDescMatch) {
    metadata.ogDescription = ogDescMatch[1].trim();
  }

  const ogImageMatch = html.match(/<meta[^>]*property=['"]*og:image['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
  if (ogImageMatch) {
    metadata.ogImage = ogImageMatch[1].trim();
  }

  // Extract headings
  metadata.headings = extractHeadings(html);
  
  // Extract links
  metadata.links = extractLinks(html, url);
  
  // Add content statistics
  metadata.contentLength = html.length;
  metadata.extractedAt = new Date().toISOString();
  
  // Extract keywords/tags if available
  const keywordsMatch = html.match(/<meta[^>]*name=['"]*keywords['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
  if (keywordsMatch) {
    metadata.keywords = keywordsMatch[1].trim().split(',').map(k => k.trim());
  }

  return metadata;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, contentId }: WebsiteExtractorRequest = await req.json();
    
    console.log('Extracting website content for:', url);
    
    if (!url || !contentId) {
      throw new Error('URL and contentId are required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShattaraBot/1.0; +https://shattara.ai)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const extractedHtml = extractCleanHTML(html);
    const extractedText = extractTextFromHTML(html);
    const websiteMetadata = extractMetadata(html, url);

    if (!extractedText || extractedText.trim().length === 0) {
      console.warn('No text extracted from website');
    }

    console.log(`Extracted ${extractedText.length} characters from website`);

    // Prepare content update data
    const contentTitle = websiteMetadata.title || websiteMetadata.ogTitle || 'Website Content';
    
    // Update content with extracted data
    const { error: contentError } = await supabase
      .from('content')
      .update({
        title: contentTitle,
        text_content: extractedHtml, // Store structured HTML for reader mode
        metadata: {
          ...websiteMetadata,
          extractedAt: new Date().toISOString(),
          contentLength: extractedText.length,
          hasContent: extractedText.length > 0,
          plainText: extractedText // Keep plain text for search/processing
        }
      })
      .eq('id', contentId);
    
    if (contentError) {
      console.error('Error updating content:', contentError);
      throw new Error('Failed to update content');
    }
    
    console.log('Website extraction completed for:', websiteMetadata.title || url);
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        textLength: extractedText.length,
        metadata: websiteMetadata
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Website extraction error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});