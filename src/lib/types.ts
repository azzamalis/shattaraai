
// Import database types from Supabase
import { Database } from '@/integrations/supabase/types';

// Re-export Room and ContentItem from hooks for backward compatibility
export type { Room } from '@/hooks/useRooms';
export type { ContentItem } from '@/hooks/useContent';

// Keep existing types that are still used
export interface DeleteItem {
  id: string;
  type: 'room' | 'card';
  name: string;
  parentName?: string;
}

export interface RoomHandlers {
  onAddRoom: () => Promise<string | null>;
  onEditRoom: (id: string, newName: string) => Promise<void>;
  onDeleteRoom: (id: string) => Promise<void>;
}

export interface ContentHandlers {
  onAddContent: (content: any) => Promise<string | null>;
  onDeleteContent: (id: string) => Promise<void>;
  onUpdateContent: (id: string, updates: any) => Promise<void>;
}

// Chat types
export type ChatTabType = 'chat' | 'flashcards' | 'quizzes' | 'summary' | 'notes';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  copyable?: boolean;
}

export interface CommandOption {
  id: string;
  label: string;
  description: string;
  category: string;
}

// Content types - expanded to include live recording and audio file types
export type ContentType = 'file' | 'video' | 'pdf' | 'live_recording' | 'audio_file' | 'youtube' | 'website' | 'text' | 'chat' | 'upload' | 'recording';

// Notes types - updated to match actual usage
export interface NotesBlock {
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'todo' | 'code' | 'quote' | 'divider';
  content: string;
  level?: number;
}

// Word-level transcription types
export interface WordSegment {
  word: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface TranscriptionSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
  words?: WordSegment[];
}

export interface TranscriptionChunk {
  chunkIndex: number;
  timestamp: number;
  text: string;
  confidence: number;
  segments: TranscriptionSegment[];
  duration: number;
  words?: WordSegment[];
}

// Recording types - expanded to include missing properties
export interface RecordingMetadata {
  duration?: number;
  size?: number;
  format?: string;
  sampleRate?: number;
  createdAt?: string;
  lastModified?: string;
  transcript?: string;
  audioUrl?: string;
  transcriptUrl?: string;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  chaptersData?: Array<{
    id: string;
    title: string;
    summary: string;
    startTime: number;
    endTime?: number;
  }>;
  wordLevelTranscript?: TranscriptionChunk[];
}

export interface RecordingStateInfo {
  state?: string;
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  transcript: string;
  isNewRecording?: boolean;
  isExistingRecording?: boolean;
  hasAudioFile?: boolean;
  hasTranscript?: boolean;
  hasChapters?: boolean;
  recordingType?: 'live' | 'uploaded';
}

// Database types for direct use
export type DbRoom = Database['public']['Tables']['rooms']['Row'];
export type DbContent = Database['public']['Tables']['content']['Row'];
export type DbRecording = Database['public']['Tables']['recordings']['Row'];
export type DbProfile = Database['public']['Tables']['profiles']['Row'];

// Enums from database
export type UserPurpose = Database['public']['Enums']['user_purpose'];
export type UserGoal = Database['public']['Enums']['user_goal'];
export type UserSource = Database['public']['Enums']['user_source'];
