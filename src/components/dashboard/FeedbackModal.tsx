
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback('');
      onOpenChange(false);
      
      toast({
        title: "Feedback Sent",
        description: "Thank you for your feedback!",
        duration: 3000,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[450px] bg-[#1A1A1A] border border-white/10 p-5 rounded-xl shadow-lg"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-white">Send Feedback</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <Textarea
            placeholder="Share your thoughts..."
            className="min-h-[120px] bg-[#222222] border-none focus-visible:ring-1 focus-visible:ring-white/20 text-white placeholder:text-gray-500 rounded-lg"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          
          <div className="flex items-center justify-between pt-2">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Image size={18} />
                <span className="sr-only">Attach image</span>
              </Button>
              
              <Button 
                className="bg-[#2323FF] hover:bg-[#2323FF]/90 text-white"
                onClick={handleSubmit}
                disabled={!feedback.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send size={16} />
                    <span>Send feedback</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
