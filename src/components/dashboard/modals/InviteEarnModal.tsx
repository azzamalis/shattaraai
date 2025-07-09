import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Gift, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface InviteEarnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function InviteEarnModal({
  open,
  onOpenChange
}: InviteEarnModalProps) {
  const {
    toast
  } = useToast();
  const inviteCode = "INVITE123";
  const inviteLink = `https://shattara.com/invite/${inviteCode}`;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Link copied!",
        description: "Invite link has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Shattara',
          text: 'Join me on Shattara and get exclusive benefits!',
          url: inviteLink
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };
  return <BaseModal open={open} onOpenChange={onOpenChange} title="Invite & Earn" description="Share Shattara with friends and earn rewards together" className="max-w-md">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Spread the love</h3>
            <p className="text-sm text-muted-foreground">Invite friends and both of you earn free months</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Friend joins</p>
              <p className="text-xs text-muted-foreground">They get 1 month free premium</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Gift className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">You earn</p>
              <p className="text-xs text-muted-foreground">1 month free premium for each referral</p>
            </div>
          </div>
        </div>

        {/* Invite Link */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Your invite link</label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-muted/50 rounded-lg border text-sm font-mono truncate">
              {inviteLink}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyLink} className="shrink-0 py-0 px-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleShare} className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </Button>
          <Button variant="outline" onClick={handleCopyLink} className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    </BaseModal>;
}