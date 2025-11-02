
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
      <DialogContent className="bg-card border-border text-foreground max-w-lg w-full overflow-hidden">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Link2 className="text-muted-foreground h-4 w-4" />
            <DialogTitle className="text-base font-medium">YouTube, Website, Etc</DialogTitle>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Enter a YouTube Link / Playlist, Website URL, Doc, ArXiv, Etc</p>
        </DialogHeader>

        {/* URL Input Section */}
        <div className="mb-6">
          <Input 
            className="bg-muted border-border h-14 px-4 text-foreground placeholder:text-muted-foreground transition-colors duration-200 rounded-2xl" 
            placeholder="https://youtu.be/dQw4w9WgXcQ" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
          />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/20 dark:border-primary/40"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-primary/50 text-sm font-medium">or</span>
          </div>
        </div>

        {/* Text Input Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardPaste className="text-muted-foreground h-4 w-4" />
            <h3 className="text-base font-medium">Paste Text</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-2">Copy and paste text to add as content</p>
          <Textarea 
            className="bg-muted border-border px-4 py-3 min-h-[45px] sm:min-h-[126px] max-h-[80px] resize-none text-foreground placeholder:text-muted-foreground transition-colors duration-200 rounded-2xl" 
            placeholder="Paste your notes here" 
            value={text} 
            onChange={e => setText(e.target.value)} 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            className="rounded-lg" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (!url && !text)} 
            className="rounded-lg"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
