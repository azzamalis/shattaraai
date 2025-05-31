
export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'text';
  isSelected: boolean;
}
