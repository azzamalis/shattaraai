import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ContentPreview } from '@/components/content/ContentPreview';

export const RecentSection: React.FC = () => {
  const { recentContent } = useContent();

  return (
    <div>
      <h2 className="text-base font-semibold mb-4 text-dashboard-text dark:text-dashboard-text">Recents</h2>
      <div className="space-y-2">
        {recentContent.length === 0 ? (
          <div className="px-3 py-4 rounded-md bg-dashboard-card dark:bg-dashboard-card border border-dashed border-dashboard-separator dark:border-dashboard-separator">
            <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm text-center">
              No recent content
            </p>
          </div>
        ) : (
          <>
            {recentContent.slice(0, 5).map((item) => (
              <Button 
                key={item.id}
                variant="ghost" 
                className="w-full justify-start text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 h-auto py-3" 
                asChild
              >
                <Link to={`/content/${item.id}?type=${item.type}`} className="flex items-center gap-3">
                  <ContentPreview type={item.type} className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 py-3" 
              asChild
            >
              <Link to="/history" className="flex items-center">
                <ChevronRight size={18} className="mr-2" />
                <span className="text-sm">Show more</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
