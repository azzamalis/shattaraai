import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface FeedbackPopoverProps {
  children: React.ReactNode;
}

export function FeedbackPopover({ children }: FeedbackPopoverProps) {
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const maxLength = 500;

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
    setOpen(false);
  };

  const handleCancel = () => {
    setFeedback("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" side="right">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Share Your Feedback</h4>
            <p className="text-sm text-muted-foreground">
              Help us improve by sharing your thoughts and suggestions.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={maxLength}
                className="min-h-[120px] resize-none"
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