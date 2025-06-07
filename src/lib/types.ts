
export interface Room {
  id: string;
  name: string;
  lastActive: string;
}

export interface DeleteItem {
  id: string;
  type: 'room' | 'card';
  name: string;
  parentName?: string;
}

export interface RoomHandlers {
  onAddRoom: () => void;
  onEditRoom: (id: string, newName: string) => void;
  onDeleteRoom: (id: string) => void;
}

export type ContentType = 'recording' | 'pdf' | 'video' | 'audio' | 'youtube' | 'website' | 'text' | 'upload' | 'chat';

export type RecordingState = 'new' | 'recording' | 'paused' | 'completed' | 'existing';

export interface RecordingMetadata {
  duration?: number;
  fileSize?: number;
  format?: string;
  sampleRate?: number;
  createdAt?: string;
  lastModified?: string;
  audioUrl?: string;
  transcriptUrl?: string;
  chaptersData?: ChapterData[];
}

export interface ChapterData {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  summary?: string;
}

export interface RecordingStateInfo {
  state: RecordingState;
  isNewRecording: boolean;
  isExistingRecording: boolean;
  hasAudioFile: boolean;
  hasTranscript: boolean;
  hasChapters: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  createdAt: string;
  url?: string;
  filename?: string;
  text?: string;
  fileSize?: number;
  duration?: number;
  thumbnail?: string;
  metadata?: Record<string, any>;
  recordingMetadata?: RecordingMetadata;
  roomId?: string;
}

export interface ContentHandlers {
  onAddContent: (content: Omit<ContentItem, 'id' | 'createdAt'>) => void;
  onDeleteContent: (id: string) => void;
}

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
  icon?: string;
  category: string;
}

export type ChatTabType = 'chat' | 'flashcards' | 'quizzes' | 'notes';

export interface NotesBlock {
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'todo' | 'code' | 'quote' | 'table' | 'divider';
  content: string;
  data?: any;
}
