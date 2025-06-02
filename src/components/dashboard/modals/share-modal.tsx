import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'content' | 'exam';
  itemToShare: {
    id: string;
    title: string;
    url?: string;
  };
}

export function ShareModal({ open, onOpenChange, type, itemToShare }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = itemToShare.url || `${window.location.origin}/share/${itemToShare.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Share ${type === 'exam' ? 'Exam' : 'Content'}`}
      description={`Share this ${type} with others`}
      className="sm:max-w-md"
    >
      <div className="space-y-6 py-4">
        <div className="flex items-center space-x-2">
          <Input
            readOnly
            value={shareUrl}
            className="flex-1 bg-muted border-none text-foreground"
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
      </div>
    </BaseModal>
  );
}
