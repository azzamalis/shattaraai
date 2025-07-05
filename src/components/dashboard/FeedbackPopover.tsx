
import React, { useState } from 'react';
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
        className="w-[450px] bg-card border-border p-5 rounded-xl shadow-lg"
        align="start"
        side="top"
        sideOffset={8}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-foreground">Send Feedback</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)} 
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <Textarea
            placeholder="Share your thoughts..."
            className="min-h-[120px] bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          
          <div className="flex items-center justify-between pt-2">
            <Button 
              variant="outline" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground"
              >
                <Image size={18} />
                <span className="sr-only">Attach image</span>
              </Button>
              
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSubmit}
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
