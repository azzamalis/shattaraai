
import React, { useState, useEffect } from 'react';
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

  // Prevent body interactions when popover is open
  useEffect(() => {
    if (open) {
      document.body.style.pointerEvents = 'none';
      // Keep the popover content interactive
      const popoverElements = document.querySelectorAll('[data-radix-popper-content-wrapper]');
      popoverElements.forEach(el => {
        (el as HTMLElement).style.pointerEvents = 'auto';
      });
      
      return () => {
        document.body.style.pointerEvents = 'auto';
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
        className="w-[450px] bg-card border-border p-0 rounded-xl shadow-lg z-[9999]"
        align="start"
        side="top"
        sideOffset={8}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="w-full max-w-md p-4" style={{ touchAction: 'manipulation' }}>
          <form className="flex flex-col space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-medium text-foreground">Send Feedback</h2>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)} 
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
                style={{ pointerEvents: 'auto' }}
              >
                <X size={18} />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts..."
                className="flex w-full max-h-[80px] rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] max-w-lg resize-none transition-all ring-primary p-3"
                style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                name="message"
              />
            </div>
            
            <div className="flex justify-between items-center gap-x-2">
              <Button 
                type="button"
                variant="outline" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
                style={{ pointerEvents: 'auto' }}
              >
                Cancel
              </Button>
              
              <div className="flex items-center gap-x-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground"
                  style={{ pointerEvents: 'auto' }}
                >
                  <Image size={18} />
                  <span className="sr-only">Attach image</span>
                </Button>
                
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!feedback.trim() || isSubmitting}
                  style={{ pointerEvents: 'auto' }}
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
