import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Link, Crown, Zap, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface InviteEarnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function InviteEarnModal({
  open,
  onOpenChange
}: InviteEarnModalProps) {
  const { toast } = useToast();
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

  return (
    <BaseModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="" 
      className="w-[95vw] max-w-[450px] sm:w-auto bg-card border-border p-0 rounded-xl shadow-lg" 
      showCloseButton={false}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-foreground">Spread the love</h2>
            <p className="text-sm text-muted-foreground">and earn free months</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* How it works section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-foreground">How it works:</h3>
          
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
                You get <span className="font-medium">1 month free</span> once they subscribe to a Pro plan
              </p>
            </div>
          </div>
        </div>

        {/* Invite link section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Your invite link:</label>
          
          <div className="flex items-center gap-2 p-3 bg-muted border-none rounded-lg">
            <Link className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-mono text-foreground truncate flex-1">{inviteLink}</span>
            <Button 
              onClick={handleCopyLink} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy link
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}