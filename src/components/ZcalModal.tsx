
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZcalModalProps {
  children: React.ReactNode;
  bookingUrl?: string;
  title?: string;
  modalName?: string;
  embedHeight?: number;
  embedWidth?: number;
}

const ZcalModal = ({ 
  children, 
  bookingUrl = "https://zcal.co/i/4vqAOC__?embed=1&embedType=iframe", 
  title = "Schedule a Demo",
  modalName = "school_demo",
  embedHeight = 870,
  embedWidth = 1096
}: ZcalModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    
    toast({
      title: "Booking Calendar Error",
      description: "We couldn't load the booking calendar. Please try again later.",
      variant: "destructive",
    });
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the Zcal domain
      if (event.origin.includes('zcal.co')) {
        try {
          const data = event.data;
          if (data.type === 'booking_completed') {
            // Show success toast
            toast({
              title: "Demo Scheduled!",
              description: "We've received your request and will be in touch soon.",
            });
            
            // Close modal after booking
            setIsOpen(false);
          }
        } catch (error) {
          console.error('Error processing message from iframe:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[1100px] bg-[#111] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full mt-4 flex justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111] z-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#2323FF]" />
            </div>
          )}
          
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111] p-4 text-center">
              <p className="text-red-500 mb-4">Unable to load the booking calendar</p>
              <p className="mb-6">Please try again later or contact us directly</p>
              <Button 
                onClick={() => {
                  window.open('mailto:contact@shattara.com', '_blank');
                }}
                className="bg-[#2323FF] hover:bg-[#2323FF]/80"
              >
                Contact Us
              </Button>
            </div>
          ) : (
            <iframe
              src={bookingUrl}
              loading="lazy"
              style={{ border: 'none', minWidth: '320px', minHeight: '544px', height: embedHeight, width: embedWidth }}
              id="zcal-invite"
              className="w-full bg-white rounded-md"
              scrolling="no"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Schedule a Demo"
              allow="camera; microphone; autoplay; encrypted-media; fullscreen;"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZcalModal;
