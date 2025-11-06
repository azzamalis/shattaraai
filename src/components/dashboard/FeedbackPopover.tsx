import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { usePopoverState } from "@/contexts/PopoverContext";

interface FeedbackPopoverProps {
  children: React.ReactNode;
}

const FEEDBACK_POPOVER_ID = "feedback-popover";

export function FeedbackPopover({ children }: FeedbackPopoverProps) {
  const [feedback, setFeedback] = useState("");
  const { openPopover, closePopover, isPopoverOpen } = usePopoverState();
  const open = isPopoverOpen(FEEDBACK_POPOVER_ID);
  const maxLength = 500;

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      openPopover(FEEDBACK_POPOVER_ID);
    } else {
      closePopover(FEEDBACK_POPOVER_ID);
    }
  };

  const handleSubmit = () => {
    if (feedback.trim().length === 0) {
      toast.error("Feedback required", {
        description: "Please enter your feedback before submitting.",
      });
      return;
    }

    // Here you would typically send the feedback to your backend
    console.log("Feedback submitted:", feedback);
    
    toast.success("Thank you!", {
      description: "Your feedback has been submitted successfully.",
    });
    
    setFeedback("");
    closePopover(FEEDBACK_POPOVER_ID);
  };

  const handleCancel = () => {
    setFeedback("");
    closePopover(FEEDBACK_POPOVER_ID);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 pointer-events-auto" 
        align="end" 
        side="right" 
        sideOffset={8}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="grid gap-4 pointer-events-auto">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Share Your Feedback</h4>
            <p className="text-sm text-muted-foreground">
              Help us improve by sharing your thoughts and suggestions.
            </p>
          </div>
          <div className="grid gap-3 pointer-events-auto">
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={maxLength}
                className="min-h-[120px] resize-none pointer-events-auto"
              />
              <p className="text-xs text-muted-foreground text-right">
                {feedback.length}/{maxLength}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="hover:bg-accent"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}