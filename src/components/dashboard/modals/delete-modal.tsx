
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

const truncateText = (text: string, maxLength: number = 40) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export function DeleteModal({
  open,
  onOpenChange,
  type,
  itemToDelete,
  onConfirm
}: DeleteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-foreground">
            Are you sure you want to delete this {type}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            "{truncateText(itemToDelete.title)}" will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-muted/50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-red-500 hover:bg-red-600 text-white focus:ring-2 focus:ring-red-500/20"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

