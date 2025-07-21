
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Link2, ClipboardPaste } from 'lucide-react';

interface PasteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    url?: string;
    text?: string;
  }) => void;
}

export function PasteContentModal({
  isOpen,
  onClose,
  onSubmit
}: PasteContentModalProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!url && !text) return;
    setIsSubmitting(true);
    // Simulate processing
    setTimeout(() => {
      onSubmit({
        url: url || undefined,
        text: text || undefined
      });
      setIsSubmitting(false);
      setUrl('');
      setText('');
    }, 800);
  };

  const handleClose = () => {
    setUrl('');
    setText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="bg-card border-border text-foreground max-w-md w-full p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Link2 className="text-muted-foreground h-4 w-4" />
              <DialogTitle className="text-lg font-medium">YouTube, Website, Etc</DialogTitle>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Enter a YouTube Link, Website URL, Doc, Etc</p>
          </DialogHeader>

          {/* URL Input Section */}
          <div className="mb-6">
            <Input 
              className="bg-muted border-border px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors duration-200" 
              placeholder="https://youtube.com/dQw4w9WgXcQ" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-muted-foreground text-sm font-bold">or</span>
            </div>
          </div>

          {/* Text Input Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardPaste className="text-muted-foreground h-4 w-4" />
              <h3 className="text-lg font-medium">Paste Text</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Copy and paste text to add as content</p>
            <Textarea 
              className="bg-muted border-border px-4 py-3 min-h-[100px] text-foreground placeholder:text-muted-foreground transition-colors duration-200" 
              placeholder="Paste your notes here" 
              value={text} 
              onChange={e => setText(e.target.value)} 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground" 
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || (!url && !text)} 
              className="bg-accent hover:bg-accent/80 text-foreground font-medium transition-colors duration-200"
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
