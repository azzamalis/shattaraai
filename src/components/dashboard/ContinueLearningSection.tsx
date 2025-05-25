
import React from 'react';
import { LearningCard } from './LearningCard';
import { useContent } from '@/contexts/ContentContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ContinueLearningProps {
  onDeleteCard: (id: string) => void;
  onShareCard: () => void;
}

export function ContinueLearningSection({ onDeleteCard, onShareCard }: ContinueLearningProps) {
  const { content } = useContent();

  if (content.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#232323] dark:text-white transition-colors duration-200">Continue learning</h2>
        </div>
        <div className="text-gray-400 text-center py-8">
          No content yet. Upload, paste, or record something to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#232323] dark:text-white transition-colors duration-200">Continue learning</h2>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">View all</button>
      </div>
      
      <div className="relative">
        <Carousel className="w-full" opts={{ align: "start", loop: false }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {content.map((item) => (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-auto">
                <LearningCard 
                  content={item}
                  onDelete={() => onDeleteCard(item.id)}
                  onShare={onShareCard}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {content.length > 1 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-12 bg-[#1A1A1A] border-white/20 text-white hover:bg-[#2A2A2A]" />
              <CarouselNext className="hidden md:flex -right-12 bg-[#1A1A1A] border-white/20 text-white hover:bg-[#2A2A2A]" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}
