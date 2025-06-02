import React from 'react';
import { LearningCard } from './LearningCard';
import { useContent } from '@/contexts/ContentContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ContentItem } from '@/lib/types';

interface ContinueLearningProps {
  onDeleteCard: (item: ContentItem) => void;
  onShareCard: (item: ContentItem) => void;
}

export function ContinueLearningSection({ onDeleteCard, onShareCard }: ContinueLearningProps) {
  const { content } = useContent();

  if (content.length === 0) {
    return (
      <section className="w-full py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Continue learning</h2>
        </div>
        <div className="text-muted-foreground text-center py-12 bg-card/20 rounded-xl border border-border/5">
          No content yet. Upload, paste, or record something to get started!
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Continue learning</h2>
        <button 
          className={cn(
            "text-sm text-muted-foreground",
            "hover:text-foreground transition-colors",
            "px-4 py-2 rounded-lg",
            "hover:bg-accent/50"
          )}
        >
          View all
        </button>
      </div>
      
      <div className="relative -mx-4 px-4">
        <Carousel 
          className="w-full" 
          opts={{ 
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true
          }}
        >
          <CarouselContent className="-ml-4">
            {content.map((item) => (
              <CarouselItem 
                key={item.id} 
                className={cn(
                  "pl-4",
                  "basis-[280px] sm:basis-[320px] md:basis-[360px]",
                  "first:pl-4"
                )}
              >
                <LearningCard 
                  content={item}
                  onDelete={() => onDeleteCard(item)}
                  onShare={() => onShareCard(item)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {content.length > 1 && (
            <>
              <CarouselPrevious 
                className={cn(
                  "hidden md:flex -left-12",
                  "bg-background/80 backdrop-blur",
                  "border-border hover:bg-accent",
                  "text-foreground",
                  "transition-colors duration-200"
                )} 
              />
              <CarouselNext 
                className={cn(
                  "hidden md:flex -right-12",
                  "bg-background/80 backdrop-blur",
                  "border-border hover:bg-accent",
                  "text-foreground",
                  "transition-colors duration-200"
                )} 
              />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
