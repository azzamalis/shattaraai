
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ContentPreview } from '@/components/content/ContentPreview';

export const RecentSection: React.FC = () => {
  const { recentContent } = useContent();

  if (recentContent.length === 0) {
    return (
      <div className="px-4 py-2">
        <h3 className="text-dashboard-text text-base font-medium mb-2 px-2">Recent</h3>
        <div className="px-2 text-dashboard-text-secondary text-xs">No recent content</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <h3 className="text-dashboard-text text-base font-medium mb-2 px-2">Recent</h3>
      <div className="space-y-1">
        {recentContent.slice(0, 5).map((item) => (
          <Button 
            key={item.id}
            variant="ghost" 
            className="w-full justify-start text-dashboard-text hover:bg-dashboard-card-hover hover:text-dashboard-text transition-colors duration-200 h-auto py-2" 
            asChild
          >
            <Link to={`/content/${item.id}?type=${item.type}`} className="flex items-center gap-2">
              <ContentPreview type={item.type} className="w-4 h-4" />
              <div className="flex-1 text-left truncate">
                <div className="text-sm truncate">{item.title}</div>
                <div className="text-xs text-dashboard-text-secondary">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          </Button>
        ))}
        {recentContent.length > 5 && (
          <Button variant="ghost" className="w-full justify-start text-dashboard-text-secondary hover:bg-dashboard-card-hover hover:text-dashboard-text transition-colors duration-200" asChild>
            <Link to="/history">
              <Clock size={18} className="mr-2" />
              <span>View all recent</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
