import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

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
        {/* Header with Icon */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-500/10 ring-1 ring-red-500/20">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Delete Confirmation
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Warning Message */}
        <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-4 border border-red-200 dark:border-red-800">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                You are about to delete:
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                "<span className="font-semibold">{itemToDelete.title}</span>"
              </p>
              {itemToDelete.parentName && (
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                  This will be removed from {itemToDelete.parentName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500/20"
          >
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
