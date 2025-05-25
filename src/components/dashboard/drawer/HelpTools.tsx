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
    <div>
      <h2 className="text-base font-semibold mb-4 text-dashboard-text dark:text-dashboard-text">Help & Tools</h2>
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start px-2 py-1.5 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200" 
          onClick={onFeedbackClick}
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-dashboard-text-secondary" />
            <span>Feedback</span>
          </div>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start px-2 py-1.5 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200" 
          onClick={onTutorialClick}
        >
          <div className="flex items-center gap-2">
            <Book size={16} className="text-dashboard-text-secondary" />
            <span>Quick Guide</span>
          </div>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start px-2 py-1.5 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200" 
          asChild
        >
          <Link to="/reports" className="flex items-center gap-2">
            <BarChart size={16} className="text-dashboard-text-secondary" />
            <span>Reports</span>
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start px-2 py-1.5 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200" 
          onClick={onCalculatorClick}
        >
          <div className="flex items-center gap-2">
            <Calculator size={16} className="text-dashboard-text-secondary" />
            <span>Calculator</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
