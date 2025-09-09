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

function extractTextFromHTML(html: string): string {
  // Remove script and style elements
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

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
        text_content: extractedText,
        metadata: {
          ...websiteMetadata,
          extractedAt: new Date().toISOString(),
          contentLength: extractedText.length,
          hasContent: extractedText.length > 0
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