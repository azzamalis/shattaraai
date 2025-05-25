
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, MessageCircle, BarChart, Calculator, Chrome } from 'lucide-react';
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
    <div className="px-2">
      <h3 className="text-base font-medium mb-4 px-2 text-dashboard-text dark:text-dashboard-text">Help & Tools</h3>
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 px-2" 
          onClick={onFeedbackClick}
        >
          <MessageCircle size={18} className="mr-3" />
          <span>Feedback</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 px-2" 
          onClick={onTutorialClick}
        >
          <Book size={18} className="mr-3" />
          <span>Quick Guide</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 px-2" 
          asChild
        >
          <Link to="/reports">
            <BarChart size={18} className="mr-3" />
            <span>Reports</span>
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 px-2" 
          asChild
        >
          <Link to="/extension">
            <Chrome size={18} className="mr-3" />
            <span>Chrome Extension</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
