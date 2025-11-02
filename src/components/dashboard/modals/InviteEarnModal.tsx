import React from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Zap, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface InviteEarnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteEarnModal({
  open,
  onOpenChange
}: InviteEarnModalProps) {
  const navigate = useNavigate();
  const inviteCode = "INVITE123";
  const inviteLink = `https://shattara.com/invite/${inviteCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link has been copied to your clipboard.");
    } catch (error) {
      toast.error("Failed to copy. Please copy the link manually.");
    }
  };

  return (
    <BaseModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="" 
      className="max-w-[95vw] md:max-w-lg border-none" 
      contentClassName="p-6 flex flex-col gap-4 overflow-y-auto max-h-[95vh]"
    >
      <DialogTitle className="sr-only">Refer &amp; Earn</DialogTitle>

      {/* Banner Section */}
      <div className="flex flex-col space-y-1.5 text-left">
        <div className="relative h-fit overflow-hidden rounded-xl">
          <img 
            src="/images/referral-dark-v2.png" 
            alt="Referral" 
            className="hidden w-full object-contain dark:block" 
          />
          <img 
            src="/images/referral-light-v2.png" 
            alt="Referral" 
            className="block w-full object-contain dark:hidden" 
          />
        </div>
      </div>

      {/* How it works section */}
      <div className="md:py-2">
        <div className="mb-3 text-base font-normal text-muted-foreground">How it works:</div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-base font-normal text-foreground">Share your invite link</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-base font-normal text-foreground">
                They sign up and get <b>1 month free</b>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-base font-normal text-foreground">
                You get <b>1 month free</b> once they upload their first content
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Invite link section */}
      <div className="flex flex-col">
        <span className="mb-3 flex items-center gap-4 pr-2 text-base font-normal text-muted-foreground">
          Your invite link:
          <div className="h-0.5 flex-1 bg-border"></div>
          <span className="flex items-center gap-2 text-muted-foreground">
            <span>used by <b>0</b> users</span>
          </span>
        </span>
        
        <div className="flex flex-col items-center space-y-2 rounded-xl bg-muted p-2 sm:flex-row sm:space-y-0">
          <div className="flex w-full flex-1 items-center px-2">
            <input 
              className="flex h-9 w-full border-none shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 bg-transparent text-base md:text-sm"
              readOnly 
              value={inviteLink}
              tabIndex={-1}
            />
          </div>
          <Button 
            onClick={handleCopyLink}
            className="h-8 px-4 py-2 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:w-24 text-sm font-medium"
          >
            Copy link
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center">
        <button 
          onClick={() => navigate('/terms')}
          className="text-xs font-normal text-muted-foreground underline hover:underline underline-offset-4 transition-colors duration-100"
        >
          View Terms and Conditions
        </button>
      </div>
    </BaseModal>
  );
}