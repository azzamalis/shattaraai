import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

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
  }>;
  metadata: {
    videoId: string;
    publishedAt: string;
    channelTitle: string;
    viewCount: string;
    thumbnails: any;
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
  
  // Look for timestamp patterns like "0:00", "1:23", "12:34", etc.
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
  
  // Set end times for chapters
  for (let i = 0; i < chapters.length - 1; i++) {
    chapters[i].endTime = chapters[i + 1].startTime;
  }
  
  return chapters;
}

async function getYouTubeData(videoId: string): Promise<YouTubeData> {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  // Get video details
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
  
  // Parse duration from ISO 8601 format (PT4M13S -> 253 seconds)
  const duration = parseDuration(video.contentDetails.duration);
  
  // Extract chapters from description
  const chapters = parseChaptersFromDescription(video.snippet.description);
  
  // Try to get captions/transcript
  let transcript = '';
  try {
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
    );
    
    if (captionsResponse.ok) {
      const captionsData = await captionsResponse.json();
      
      if (captionsData.items && captionsData.items.length > 0) {
        // Find English captions or first available
        const englishCaption = captionsData.items.find((item: any) => 
          item.snippet.language === 'en' || item.snippet.language === 'en-US'
        ) || captionsData.items[0];
        
        // Note: Getting actual transcript content requires additional OAuth setup
        // For now, we'll use the description as fallback content
        transcript = video.snippet.description;
      }
    }
  } catch (error) {
    console.log('Could not fetch captions:', error);
    transcript = video.snippet.description;
  }
  
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
      thumbnails: video.snippet.thumbnails
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
    const { url, contentId }: YouTubeExtractorRequest = await req.json();
    
    console.log('Extracting YouTube data for:', url);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    const youtubeData = await getYouTubeData(videoId);
    
    // Update content with extracted data
    const { error: contentError } = await supabase
      .from('content')
      .update({
        title: youtubeData.title,
        text_content: youtubeData.transcript,
        metadata: {
          ...youtubeData.metadata,
          chapters: youtubeData.chapters,
          extractedAt: new Date().toISOString(),
          hasTranscript: youtubeData.transcript.length > 0,
          hasChapters: youtubeData.chapters.length > 0
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
      // Don't throw error as content update succeeded
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