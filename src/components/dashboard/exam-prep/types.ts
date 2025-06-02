import type { ContentTag, ContentType } from '../RoomContentTable';

export interface ContentItem {
  id: string;
  title: string;
  uploadedDate: string;
  type: 'Video' | 'PDF Files' | 'Recording' | 'Youtube URL';
  isSelected: boolean;
}
