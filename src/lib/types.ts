
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

export type ContentType = 'recording' | 'pdf' | 'video' | 'audio' | 'youtube' | 'website' | 'text' | 'upload';

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
}

export interface ContentHandlers {
  onAddContent: (content: Omit<ContentItem, 'id' | 'createdAt'>) => void;
  onDeleteContent: (id: string) => void;
}
