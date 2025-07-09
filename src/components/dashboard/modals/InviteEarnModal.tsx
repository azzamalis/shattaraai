import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Link, Crown, Zap } from 'lucide-react';
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
  return <BaseModal open={open} onOpenChange={onOpenChange} title="" className="max-w-md p-0" showCloseButton={true}>
      <div className="relative p-6">
        {/* Header with gradient background */}
        <div className="text-center space-y-3 mb-6">
          {/* Decorative gradient background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="relative">
            
            <h1 className="text-2xl font-bold text-foreground mb-2">Spread the love</h1>
            <p className="text-sm text-muted-foreground">and earn free months</p>
          </div>
        </div>

        {/* How it works section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">How it works:</h3>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium">Share your invite link</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Crown className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                They sign up and get <span className="font-medium">1 month free</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <div className="w-3 h-3 rounded bg-primary"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                You get <span className="font-medium">1 month free</span> once they upload their first content
              </p>
            </div>
          </div>
        </div>

        {/* Invite link section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Your invite link:</label>
          
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg">
              <Link className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-mono text-foreground truncate">{inviteLink}</span>
            </div>
          </div>

          {/* Copy button */}
          <Button onClick={handleCopyLink} className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium">
            Copy link
          </Button>

          {/* Terms link */}
          <div className="text-center pt-2">
            
          </div>
        </div>
      </div>
    </BaseModal>;
}