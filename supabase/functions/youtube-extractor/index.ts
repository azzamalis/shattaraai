import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YouTubeExtractorRequest {
  url: string;
  contentId: string;
}

interface YouTubeData {
  title: string;
  description: string;
  duration: number;
  transcript: string;
  chapters: Array<{
    title: string;
    startTime: number;
    endTime?: number;
    transcript?: string;
  }>;
  metadata: {
    videoId: string;
    publishedAt: string;
    channelTitle: string;
    viewCount: string;
    thumbnails: any;
    hasRealTranscript: boolean;
  };
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function parseChaptersFromDescription(description: string): Array<{title: string; startTime: number; endTime?: number}> {
  const chapters = [];
  const lines = description.split('\n');
  
  const timestampPattern = /^(\d{1,2}:)?(\d{1,2}):(\d{2})\s+(.+)/;
  
  for (const line of lines) {
    const match = line.trim().match(timestampPattern);
    if (match) {
      const hours = match[1] ? parseInt(match[1].replace(':', '')) : 0;
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);
      const title = match[4].trim();
      
      const startTime = hours * 3600 + minutes * 60 + seconds;
      chapters.push({ title, startTime });
    }
  }
  
  for (let i = 0; i < chapters.length - 1; i++) {
    chapters[i].endTime = chapters[i + 1].startTime;
  }
  
  return chapters;
}

function extractChapterTranscripts(transcript: string, chapters: Array<{title: string; startTime: number; endTime?: number}>): Array<{title: string; startTime: number; endTime?: number; transcript?: string}> {
  return chapters.map(chapter => ({
    ...chapter,
    transcript: `Chapter content for "${chapter.title}" would be extracted from the full transcript based on timestamp ${chapter.startTime}s${chapter.endTime ? ` to ${chapter.endTime}s` : ''}.`
  }));
}

function parseTranscriptXml(xml: string): string {
  try {
    const textMatches = xml.match(/<text[^>]*>(.*?)<\/text>/g);
    if (!textMatches) return '';
    
    return textMatches
      .map(match => {
        const textContent = match.replace(/<text[^>]*>/, '').replace(/<\/text>/, '');
        return textContent
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim();
      })
      .filter(text => text.length > 0)
      .join(' ');
  } catch (error) {
    console.log('Error parsing transcript XML:', error);
    return '';
  }
}

async function getYouTubeData(videoId: string): Promise<YouTubeData> {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const videoResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
  );
  
  if (!videoResponse.ok) {
    throw new Error(`YouTube API error: ${videoResponse.status}`);
  }
  
  const videoData = await videoResponse.json();
  
  if (!videoData.items || videoData.items.length === 0) {
    throw new Error('Video not found or not accessible');
  }
  
  const video = videoData.items[0];
  const duration = parseDuration(video.contentDetails.duration);
  
  let transcript = '';
  try {
    const transcriptUrl = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`;
    const transcriptResponse = await fetch(transcriptUrl);
    
    if (transcriptResponse.ok) {
      const transcriptXml = await transcriptResponse.text();
      transcript = parseTranscriptXml(transcriptXml);
    } else {
      const autoTranscriptUrl = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}&tlang=en`;
      const autoResponse = await fetch(autoTranscriptUrl);
      
      if (autoResponse.ok) {
        const autoTranscriptXml = await autoResponse.text();
        transcript = parseTranscriptXml(autoTranscriptXml);
      }
    }
    
    if (!transcript.trim()) {
      transcript = video.snippet.description;
    }
  } catch (error) {
    console.log('Could not fetch transcript:', error);
    transcript = video.snippet.description;
  }
  
  const rawChapters = parseChaptersFromDescription(video.snippet.description);
  const chapters = extractChapterTranscripts(transcript, rawChapters);
  const hasRealTranscript = transcript !== video.snippet.description && transcript.trim().length > 0;
  
  return {
    title: video.snippet.title,
    description: video.snippet.description,
    duration,
    transcript,
    chapters,
    metadata: {
      videoId,
      publishedAt: video.snippet.publishedAt,
      channelTitle: video.snippet.channelTitle,
      viewCount: video.statistics.viewCount,
      thumbnails: video.snippet.thumbnails,
      hasRealTranscript
    }
  };
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  return hours * 3600 + minutes * 60 + seconds;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ========== IP-BASED RATE LIMITING ==========
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log('YouTube extractor request from IP:', clientIP);

    const { data: rateCheck, error: rateError } = await supabase.rpc('check_ip_rate_limit', {
      p_ip_address: clientIP,
      p_endpoint: 'youtube-extractor',
      p_max_requests: 20,  // 20 requests per hour
      p_window_minutes: 60
    });

    if (rateError) {
      console.error('Rate limit check error:', rateError);
      // Continue anyway - don't block on rate limit errors
    } else if (rateCheck && rateCheck.length > 0 && !rateCheck[0].allowed) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          reset_time: rateCheck[0].reset_time
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '3600'
          } 
        }
      );
    }

    const { url, contentId }: YouTubeExtractorRequest = await req.json();
    
    console.log('Extracting YouTube data for:', url);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    const youtubeData = await getYouTubeData(videoId);
    
    // Store YouTube URL in the youtube-content bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('youtube-content')
      .upload(`${contentId}/metadata.json`, JSON.stringify({
        url,
        videoId,
        extractedAt: new Date().toISOString()
      }), {
        contentType: 'application/json',
        upsert: true
      });

    const storagePath = uploadData?.path || url;

    // Update content with extracted data and storage path
    const { error: contentError } = await supabase
      .from('content')
      .update({
        title: youtubeData.title,
        filename: youtubeData.title,
        storage_path: storagePath,
        text_content: youtubeData.transcript,
        chapters: youtubeData.chapters,
        processing_status: 'completed',
        metadata: {
          ...youtubeData.metadata,
          chapters: youtubeData.chapters,
          extractedAt: new Date().toISOString(),
          hasTranscript: youtubeData.transcript.length > 0,
          hasChapters: youtubeData.chapters.length > 0,
          hasRealTranscript: youtubeData.metadata.hasRealTranscript
        }
      })
      .eq('id', contentId);
    
    if (contentError) {
      console.error('Error updating content:', contentError);
      throw new Error('Failed to update content');
    }
    
    // Create or update recording entry
    const { error: recordingError } = await supabase
      .from('recordings')
      .upsert({
        content_id: contentId,
        duration: youtubeData.duration,
        transcript: youtubeData.transcript,
        chapters: youtubeData.chapters,
        processing_status: 'completed'
      });
    
    if (recordingError) {
      console.error('Error creating recording:', recordingError);
    }
    
    console.log('YouTube extraction completed for:', youtubeData.title);
    
    return new Response(JSON.stringify({
      success: true,
      data: youtubeData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('YouTube extraction error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
