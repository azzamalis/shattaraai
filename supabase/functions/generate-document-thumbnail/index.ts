import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import mammoth from "npm:mammoth@1.9.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  contentId: string;
  url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { contentId, url }: RequestBody = await req.json();

    console.log('Generating thumbnail for content:', contentId);

    // Download the DOCX file
    const fileResponse = await fetch(url);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.statusText}`);
    }

    const arrayBuffer = await fileResponse.arrayBuffer();

    // Convert DOCX to HTML to get preview text
    const result = await mammoth.convertToHtml({ arrayBuffer } as any, {
      includeDefaultStyleMap: true,
    });

    const html = result.value;
    const tempDiv = { innerHTML: html };
    const text = html.replace(/<[^>]*>/g, ' ').substring(0, 500);

    // Create SVG thumbnail with document preview
    const svgThumbnail = createSVGThumbnail(text);

    // Convert SVG to blob
    const svgBlob = new Blob([svgThumbnail], { type: 'image/svg+xml' });

    // Upload thumbnail to storage
    const thumbnailPath = `thumbnails/${contentId}.svg`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(thumbnailPath, svgBlob, {
        contentType: 'image/svg+xml',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading thumbnail:', uploadError);
      throw uploadError;
    }

    // Get public URL for the thumbnail
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(thumbnailPath);

    // Update content record with thumbnail URL
    const { error: updateError } = await supabase
      .from('content')
      .update({ thumbnail_url: publicUrl })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error updating content:', updateError);
      throw updateError;
    }

    console.log('Thumbnail generated successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        thumbnailUrl: publicUrl 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-document-thumbnail:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate thumbnail' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function createSVGThumbnail(text: string): string {
  // Clean and truncate text
  const cleanText = text
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300);

  // Split text into lines for better display
  const lines = wrapText(cleanText, 40);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #ffffff; }
      .border { fill: none; stroke: #e5e7eb; stroke-width: 2; }
      .icon { fill: #6b7280; }
      .text { 
        font-family: 'Arial', sans-serif; 
        font-size: 10px; 
        fill: #374151;
        line-height: 14px;
      }
      .title {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        font-weight: bold;
        fill: #1f2937;
      }
    </style>
  </defs>
  
  <!-- Background -->
  <rect class="bg" width="200" height="280" rx="8"/>
  <rect class="border" x="1" y="1" width="198" height="278" rx="8"/>
  
  <!-- Document icon -->
  <path class="icon" d="M60,20 L60,60 L100,60 L140,20 Z M60,20 L60,60 M100,60 L100,20" 
        stroke="#6b7280" stroke-width="2" fill="none"/>
  
  <!-- Document title -->
  <text class="title" x="100" y="90" text-anchor="middle">Document Preview</text>
  
  <!-- Preview text -->
  ${lines.map((line, i) => 
    `<text class="text" x="20" y="${120 + i * 16}">${escapeXml(line)}</text>`
  ).join('\n  ')}
  
  ${lines.length < 10 ? '<text class="text" x="20" y="260" opacity="0.5">...</text>' : ''}
</svg>`;
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
    
    if (lines.length >= 10) break;
  }
  
  if (currentLine && lines.length < 10) {
    lines.push(currentLine);
  }

  return lines;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
