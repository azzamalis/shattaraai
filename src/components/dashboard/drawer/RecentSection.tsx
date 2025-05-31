import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ContentPreview } from '@/components/content/ContentPreview';

export const RecentSection: React.FC = () => {
  const { recentContent } = useContent();

  // Sort content by date and take the first 5
  const sortedRecentContent = [...recentContent]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <p className="ml-2 text-sm mb-2 font-semibold text-foreground">Recents</p>
      <div className="flex flex-col space-y-1">
        {sortedRecentContent.length === 0 ? (
          <div className="px-3 py-4 rounded-lg bg-primary/5 border border-dashed border-primary/10">
            <p className="text-primary/60 text-sm text-center">
              No recent content
            </p>
          </div>
        ) : (
          <>
            {sortedRecentContent.map((item) => (
              <Button 
                key={item.id}
                variant="ghost" 
                className="w-full inline-flex text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent rounded-lg group items-center h-fit p-2 truncate justify-between text-primary/80 hover:text-primary hover:bg-primary/5 underline-none text-left" 
                asChild
              >
                <Link to={`/content/${item.id}?type=${item.type}`} className="w-full flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ContentPreview type={item.type} className="w-4 h-4 flex-shrink-0" />
                    <p className="truncate text-sm font-normal">{item.title}</p>
                  </div>
                  <MoreHorizontal className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 text-primary" />
                </Link>
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
