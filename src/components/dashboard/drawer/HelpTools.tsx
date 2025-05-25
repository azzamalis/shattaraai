
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, MessageCircle, BarChart, Calculator } from 'lucide-react';
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
    <div className="px-4 py-2">
      <h3 className="text-dashboard-text text-base font-medium mb-2 px-2">Help & Tools</h3>
      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start text-dashboard-text hover:bg-dashboard-card-hover hover:text-dashboard-text transition-colors duration-200" onClick={onTutorialClick}>
          <Book size={18} className="mr-2" />
          <span>Tutorial</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-dashboard-text hover:bg-dashboard-card-hover hover:text-dashboard-text transition-colors duration-200" onClick={onFeedbackClick}>
          <MessageCircle size={18} className="mr-2" />
          <span>Feedback</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-dashboard-text hover:bg-dashboard-card-hover hover:text-dashboard-text transition-colors duration-200" asChild>
          <Link to="/reports">
            <BarChart size={18} className="mr-2" />
            <span>Reports</span>
          </Link>
        </Button>
        <Button variant="ghost" className="w-full flex items-center justify-center gap-2 
            bg-transparent border border-dashed border-dashboard-separator 
            text-dashboard-text hover:bg-dashboard-card-hover hover:text-dashboard-text
            transition-colors duration-200
            rounded-md mt-4 py-2" onClick={onCalculatorClick}>
          <Calculator size={18} />
          <span>Calculator</span>
        </Button>
      </div>
    </div>
  );
};
