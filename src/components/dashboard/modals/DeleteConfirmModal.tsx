
import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DeleteItem } from '@/lib/types';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToDelete: DeleteItem | null;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ open, onOpenChange, itemToDelete, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] text-white border-white/10 p-6 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-500/10">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold">
            Delete {itemToDelete?.type === 'card' ? 'Card' : 'Room'}
          </h2>
        </div>

        {/* Message */}
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete "<span className="text-white">{itemToDelete?.name}</span>"?
          {itemToDelete?.type === 'card' && itemToDelete?.parentName && (
            <span className="block mt-1 text-sm">
              This card will be removed from <span className="text-white">{itemToDelete.parentName}</span>
            </span>
          )}
          <br />
          <span className="text-sm opacity-75">This action cannot be undone.</span>
        </p>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-3">
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white hover:bg-white/5
                px-4 py-2 transition-colors duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            className="bg-red-500 hover:bg-red-600 text-white px-4"
            onClick={onConfirm}
          >
            Delete {itemToDelete?.type === 'card' ? 'Card' : 'Room'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
