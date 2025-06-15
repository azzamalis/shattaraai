
import { ContentItem } from '@/lib/types';

export type ContentTag = 'Summary' | 'Notes' | 'Exams' | 'Flashcards';
export type ContentType = 'Video' | 'PDF Files' | 'Recording' | 'Youtube URL';

export interface ContentTableRowProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onShare: (item: ContentItem) => void;
  showSelectionColumn?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface RoomContentTableProps {
  items: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  showSelectionColumn?: boolean;
  onSelect?: (id: string) => void;
  selectedItems?: string[];
}
