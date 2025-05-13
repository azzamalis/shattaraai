
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
import { useModalAnalytics } from '@/hooks/use-modal-analytics';
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
  const { trackModalOpen, trackModalAction } = useModalAnalytics();
  const { toast } = useToast();

  const handleIframeLoad = () => {
    setIsLoading(false);
    trackModalAction(modalName, 'iframe_loaded');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    trackModalAction(modalName, 'iframe_error');
    
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
            // Track successful booking
            trackModalAction(modalName, 'booking_completed', {
              booking_id: data.bookingId
            });
            
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
  }, [modalName, trackModalAction, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        trackModalOpen(modalName);
      }
    }}>
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
                  trackModalAction(modalName, 'contact_email_clicked');
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
