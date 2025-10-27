import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
interface FeedbackPopoverProps {
  children: React.ReactNode;
}
export function FeedbackPopover({
  children
}: FeedbackPopoverProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    toast
  } = useToast();
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
        duration: 3000
      });
    }, 1000);
  };
  return <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      
      {open && <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/10" onClick={() => setOpen(false)} />
          
          {/* Modal Content - positioned like a popover */}
          <div className="relative bg-card border border-border rounded-xl shadow-lg w-[450px] p-0 m-4">
            <div className="w-full max-w-md p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-medium text-foreground">Send Feedback</h2>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl">
                    <X size={18} />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Textarea placeholder="Share your thoughts..." className="min-h-[120px] resize-none" value={feedback} onChange={e => setFeedback(e.target.value)} name="message" autoFocus />
                </div>
                
                <div className="flex justify-between items-center gap-x-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground rounded-xl">
                    Cancel
                  </Button>
                  
                  <div className="flex items-center gap-x-2">
                    
                    
                    <Button onClick={handleSubmit} disabled={!feedback.trim() || isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                      {isSubmitting ? <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                          <span>Sending...</span>
                        </div> : <span>Send feedback</span>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </>;
}