import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Link, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        url,
        text
      });
      setIsSubmitting(false);
      setUrl('');
      setText('');
      onClose();
    }, 800);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Content</DialogTitle>
          <DialogDescription>
            Enter a YouTube Link, Website URL, or paste text content
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input 
              placeholder="https://youtube.com/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className={cn(
                "w-full",
                url && !isValidUrl(url) && "border-red-500"
              )}
            />
            {url && !isValidUrl(url) && (
              <p className="text-sm text-red-500">Please enter a valid URL</p>
            )}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Textarea
            placeholder="Paste your text content here..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={(!url && !text) || (url && !isValidUrl(url))}
          >
            Add Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
