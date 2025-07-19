
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
  return <BaseModal open={open} onOpenChange={onOpenChange} title="" className="sm:max-w-lg" showCloseButton={false}>
      <div className="space-y-4 py-1">
        {/* Header with close button */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Are you sure you want to delete this {type}?
          </h3>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 rounded-md hover:bg-muted/50">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground">
          "<span className="truncate max-w-[300px]">{itemToDelete.title}</span>" will be permanently deleted.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 py-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-muted/50">
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => {
          onConfirm();
          onOpenChange(false);
        }} className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500/20">
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>;
}
