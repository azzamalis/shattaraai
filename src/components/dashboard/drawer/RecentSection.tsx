
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ContentPreview } from '@/components/content/ContentPreview';

export const RecentSection: React.FC = () => {
  const { recentContent } = useContent();

  return (
    <div className="px-2">
      <h3 className="text-base font-medium mb-4 px-2 text-dashboard-text dark:text-dashboard-text">Recents</h3>
      <div className="space-y-1">
        {recentContent.length === 0 ? (
          <div className="px-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm py-2">
            No recent content
          </div>
        ) : (
          <>
            {recentContent.slice(0, 5).map((item) => (
              <Button 
                key={item.id}
                variant="ghost" 
                className="w-full justify-start text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 h-auto py-2 px-2" 
                asChild
              >
                <Link to={`/content/${item.id}?type=${item.type}`} className="flex items-center gap-3">
                  <ContentPreview type={item.type} className="w-4 h-4" />
                  <div className="flex-1 text-left truncate">
                    <div className="text-sm truncate">{item.title}</div>
                    <div className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
            {recentContent.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200 px-2" 
                asChild
              >
                <Link to="/history" className="flex items-center gap-3">
                  <ChevronRight size={16} />
                  <span className="text-sm">Show more</span>
                </Link>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
