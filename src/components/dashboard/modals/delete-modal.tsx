import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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
      title={`Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      className="sm:max-w-md"
    >
      <div className="space-y-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/10">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-foreground">
              Are you sure you want to delete "<span className="font-medium">{itemToDelete.title}</span>"?
            </p>
            {itemToDelete.parentName && (
              <p className="text-sm text-muted-foreground mt-1">
                This will be removed from {itemToDelete.parentName}
              </p>
            )}
          </div>
        </div>

        {/* Warning */}
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
