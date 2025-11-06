
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, MessageCircle, Calculator, BarChart, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeedbackPopover } from '@/components/dashboard/FeedbackPopover';

interface HelpToolsProps {
  onTutorialClick: () => void;
  onFeedbackClick: () => void;
  onCalculatorClick: () => void;
  onInviteEarnClick: () => void;
}

export const HelpTools: React.FC<HelpToolsProps> = ({
  onTutorialClick,
  onFeedbackClick,
  onCalculatorClick,
  onInviteEarnClick
}) => {
  return (
    <div>
      <h2 className="ml-2 mb-2 text-foreground text-sm font-semibold">Help & Tools</h2>
      <div className="flex flex-col space-y-1 text-muted-foreground font-medium">
        <FeedbackPopover>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start gap-2 
              bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary
              transition-all duration-200 rounded-xl py-2 px-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Feedback</span>
          </Button>
        </FeedbackPopover>
        
        <Button variant="ghost" className="w-full flex items-center justify-start gap-2 
            bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary
            transition-all duration-200 rounded-xl py-2 px-2" onClick={onTutorialClick}>
          <Book className="h-4 w-4" />
          <span className="relative text-sm font-medium">
            Tutorial
            <span className="absolute -top-1.5 right-[-6px] flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-green-500/60 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
          </span>
        </Button>

        <Button variant="ghost" className="w-full flex items-center justify-start gap-2 
            bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary
            transition-all duration-200 rounded-xl py-2 px-2" asChild>
          <Link to="/reports" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="text-sm font-medium">Reports</span>
          </Link>
        </Button>
        
        <Button variant="ghost" className="w-full flex items-center justify-start gap-2 
            bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary
            transition-all duration-200 rounded-xl py-2 px-2" onClick={onCalculatorClick}>
          <Calculator className="h-4 w-4" />
          <span className="text-sm font-medium">Calculator</span>
        </Button>

        <Button variant="ghost" className="w-full flex items-center justify-start gap-2 
            bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary
            transition-all duration-200 rounded-xl py-2 px-2" onClick={onInviteEarnClick}>
          <Gift className="h-4 w-4" />
          <span className="text-sm font-medium">Invite & Earn</span>
        </Button>
      </div>
    </div>
  );
};
