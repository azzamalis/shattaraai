import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Share2 } from 'lucide-react';

interface ShareExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareExamModal({ isOpen, onClose }: ShareExamModalProps) {
  const [copied, setCopied] = useState(false);
  const examLink = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(examLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Exam Results
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={examLink}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-sm"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 