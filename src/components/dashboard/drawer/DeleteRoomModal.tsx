import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  onConfirm: () => void;
}

export const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({
  open,
  onOpenChange,
  roomName,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-500/10">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Delete Room</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete "{roomName}"? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button 
            variant="ghost" 
            className="text-foreground hover:bg-accent" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-500 text-white hover:bg-red-600 transition-colors" 
            onClick={onConfirm}
          >
            Delete Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
