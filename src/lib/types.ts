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