import React, { useState } from 'react';
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
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[450px] p-6 m-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">Send Feedback</h2>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setOpen(false)} 
                  className="h-8 w-8"
                >
                  <X size={18} />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              
              <div>
                <textarea
                  placeholder="Share your thoughts..."
                  className="w-full min-h-[120px] p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                  >
                    <Image size={18} />
                    <span className="sr-only">Attach image</span>
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={!feedback.trim() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <span>Send feedback</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}