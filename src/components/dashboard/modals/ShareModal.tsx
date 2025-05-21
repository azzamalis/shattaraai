import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share, X, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ open, onOpenChange }: ShareModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!p-0 !border-0 !shadow-none !bg-transparent">
        <div className="bg-[#1A1A1A] rounded-xl w-full border border-white/[0.02]">
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Share className="w-5 h-5 text-white" />
              <span className="text-white text-base">Share public link to content</span>
            </div>
            <DialogClose asChild>
              <button className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </DialogClose>
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 min-w-0 bg-black/50 rounded-lg px-3 py-2 text-gray-400 text-sm">
                <span className="truncate block">https://shattara.ai/dashboard/room/1588830905134054</span>
              </div>
              <Button 
                className="bg-white hover:bg-white/90 rounded-lg px-4 py-2 flex items-center gap-2 whitespace-nowrap" 
                onClick={() => {
                  navigator.clipboard.writeText("https://shattara.ai/dashboard/room/1588830905134054");
                  toast.success("Link copied to clipboard");
                }}
              >
                <Copy className="w-4 h-4 text-black" />
                <span className="text-sm font-medium text-black">Copy link</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
