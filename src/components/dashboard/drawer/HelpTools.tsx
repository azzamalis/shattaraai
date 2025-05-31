import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, MessageCircle, Calculator, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HelpToolsProps {
  onTutorialClick: () => void;
  onFeedbackClick: () => void;
  onCalculatorClick: () => void;
}

export const HelpTools: React.FC<HelpToolsProps> = ({ 
  onTutorialClick, 
  onFeedbackClick,
  onCalculatorClick
}) => {
  return (
    <div>
      <h2 className="ml-2 text-sm mb-2 font-semibold text-foreground">Help & Tools</h2>
      <div className="flex flex-col space-y-1">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-2 
            bg-transparent text-primary/80 hover:bg-primary/5 hover:text-primary
            transition-colors duration-200 rounded-lg py-2 px-2" 
          onClick={onFeedbackClick}
        >
          <MessageCircle className="h-4 w-4 text-primary/60" />
          <span className="text-sm font-normal">Feedback</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-2 
            bg-transparent text-primary/80 hover:bg-primary/5 hover:text-primary
            transition-colors duration-200 rounded-lg py-2 px-2" 
          onClick={onTutorialClick}
        >
          <Book className="h-4 w-4 text-primary/60" />
          <span className="text-sm font-normal relative">
            Tutorial
            <span className="absolute -top-1.5 right-[-6px] flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-green-500/60 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
          </span>
        </Button>

        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-2 
            bg-transparent text-primary/80 hover:bg-primary/5 hover:text-primary
            transition-colors duration-200 rounded-lg py-2 px-2" 
          asChild
        >
          <Link to="/reports" className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-primary/60" />
            <span className="text-sm font-normal">Reports</span>
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-2 
            bg-transparent text-primary/80 hover:bg-primary/5 hover:text-primary
            transition-colors duration-200 rounded-lg py-2 px-2" 
          onClick={onCalculatorClick}
        >
          <Calculator className="h-4 w-4 text-primary/60" />
          <span className="text-sm font-normal">Calculator</span>
        </Button>
      </div>
    </div>
  );
};
