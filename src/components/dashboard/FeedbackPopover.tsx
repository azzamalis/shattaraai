import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FeedbackPopoverProps {
  children: React.ReactNode;
}

export function FeedbackPopover({ children }: FeedbackPopoverProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Alternative approach: Use CSS backdrop instead of disabling body pointer events
  useEffect(() => {
    if (open) {
      // Add backdrop overlay to prevent clicking outside without disabling pointer events
      const backdrop = document.createElement('div');
      backdrop.className = 'feedback-popover-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9998;
        background: rgba(0, 0, 0, 0.1);
        pointer-events: auto;
      `;
      
      // Close popover when backdrop is clicked
      backdrop.addEventListener('click', () => setOpen(false));
      document.body.appendChild(backdrop);
      
      return () => {
        document.body.removeChild(backdrop);
      };
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback('');
      setOpen(false);
      
      toast({
        title: "Feedback Sent",
        description: "Thank you for your feedback!",
        duration: 3000,
      });
    }, 1000);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        ref={popoverRef}
        className="w-[450px] bg-card border-border p-0 rounded-xl shadow-lg z-[9999]"
        align="start"
        side="top"
        sideOffset={8}
        style={{ pointerEvents: 'auto' }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-md p-4">
          <form className="flex flex-col space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-medium text-foreground">Send Feedback</h2>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)} 
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X size={18} />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts..."
                className="flex w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none p-3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                name="message"
                autoFocus
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="flex justify-between items-center gap-x-2">
              <Button 
                type="button"
                variant="outline" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              
              <div className="flex items-center gap-x-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Image size={18} />
                  <span className="sr-only">Attach image</span>
                </Button>
                
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!feedback.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <span>Send feedback</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}