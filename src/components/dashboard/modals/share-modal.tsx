import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check, Link2, Twitter, Linkedin, MessageCircle } from 'lucide-react';
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

  const handleSocialShare = (platform: string) => {
    const text = `Check out this ${type}: ${itemToShare.title}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
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
        {/* Header with Icon */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Share2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {itemToShare.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Share this {type} with your team or friends
            </p>
          </div>
        </div>

        {/* URL Input Section */}
        <div className="space-y-2">
          <label htmlFor="share-url" className="text-sm font-medium text-foreground">
            Share Link
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="share-url"
                readOnly
                value={shareUrl}
                className="pl-9 bg-muted/50 border-border/50 text-foreground"
              />
            </div>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex items-center gap-2 min-w-[100px]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Social Share Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Share via
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="flex-1 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
              onClick={() => handleSocialShare('twitter')}
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex-1 hover:bg-[#25D366]/10 hover:text-[#25D366]"
              onClick={() => handleSocialShare('whatsapp')}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="sr-only">Share on WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex-1 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
              onClick={() => handleSocialShare('linkedin')}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
