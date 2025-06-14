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

// Database types for direct use
export type DbRoom = Database['public']['Tables']['rooms']['Row'];
export type DbContent = Database['public']['Tables']['content']['Row'];
export type DbProfile = Database['public']['Tables']['profiles']['Row'];

// Enums from database
export type UserPurpose = Database['public']['Enums']['user_purpose'];
export type UserGoal = Database['public']['Enums']['user_goal'];
export type UserSource = Database['public']['Enums']['user_source'];
