
import React from 'react';
import { LearningCard } from './LearningCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ContentItem } from '@/lib/types';

interface ExploreContentProps {
  onDeleteCard: (item: ContentItem) => void;
  onShareCard: (item: ContentItem) => void;
}

// General knowledge content data
const exploreContentData: ContentItem[] = [
  {
    id: 'explore-1',
    title: 'The Science of Climate Change',
    type: 'pdf',
    createdAt: new Date().toISOString(),
    filename: 'climate-science.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    metadata: {
      pages: 45,
      progress: 0.0
    }
  },
  {
    id: 'explore-2',
    title: 'Ancient Civilizations: Egypt',
    type: 'video',
    createdAt: new Date().toISOString(),
    duration: 2400,
    thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e',
    metadata: {
      duration: '40 mins',
      progress: 0.0
    }
  },
  {
    id: 'explore-3',
    title: 'Introduction to Philosophy',
    type: 'website',
    createdAt: new Date().toISOString(),
    url: 'https://plato.stanford.edu/entries/philosophy/',
    text: 'Explore fundamental questions about existence, knowledge, values...',
    metadata: {
      readTime: '25 mins',
      progress: 0.0
    }
  },
  {
    id: 'explore-4',
    title: 'The Human Brain Explained',
    type: 'youtube',
    createdAt: new Date().toISOString(),
    url: 'https://youtube.com/watch?v=neuroscience-explained',
    duration: 1800,
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    metadata: {
      duration: '30 mins',
      progress: 0.0
    }
  },
  {
    id: 'explore-5',
    title: 'World History Timeline',
    type: 'pdf',
    createdAt: new Date().toISOString(),
    filename: 'world-history.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1',
    metadata: {
      pages: 120,
      progress: 0.0
    }
  },
  {
    id: 'explore-6',
    title: 'Mathematics in Nature',
    type: 'recording',
    createdAt: new Date().toISOString(),
    duration: 2700,
    metadata: {
      duration: '45 mins',
      progress: 0.0
    }
  }
];

export function ExploreContentSection({ onDeleteCard, onShareCard }: ExploreContentProps) {
  return (
    <section className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Explore Content</h2>
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
            {exploreContentData.map((item) => (
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
          {exploreContentData.length > 1 && (
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
