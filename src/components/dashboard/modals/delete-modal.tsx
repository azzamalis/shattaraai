import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'room' | 'content' | 'exam';
  itemToDelete: {
    id: string;
    title: string;
    parentName?: string;
  };
  onConfirm: () => void;
}

export function DeleteModal({
  open,
  onOpenChange,
  type,
  itemToDelete,
  onConfirm
}: DeleteModalProps) {
  return (
    <BaseModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="" 
      className="sm:max-w-lg" 
      showCloseButton={false}
      contentClassName="bg-card border-border"
    >
      <div className="space-y-6 p-6">
        {/* Header with close button */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            Are you sure you want to delete this {type}?
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground">
          "<span className="font-medium text-card-foreground">{itemToDelete.title}</span>" will be permanently deleted and cannot be recovered.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}