
import React from 'react';
import { EnhancedLearningCard } from './enhanced/EnhancedLearningCard';
import { useContent } from '@/contexts/ContentContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ContentItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

interface ContinueLearningProps {
  onDeleteCard: (item: ContentItem) => void;
  onShareCard: (item: ContentItem) => void;
  onAddToRoom?: (item: ContentItem, roomId: string) => void;
  availableRooms?: Array<{ id: string; name: string }>;
  currentRoom?: { id: string; name: string };
}

export function ContinueLearningSection({
  onDeleteCard,
  onShareCard,
  onAddToRoom,
  availableRooms = [],
  currentRoom
}: ContinueLearningProps) {
  const { content } = useContent();

  const handleAddToRoom = (roomId: string, item: ContentItem) => {
    if (onAddToRoom) {
      onAddToRoom(item, roomId);
    }
  };

  if (content.length === 0) {
    return (
      <motion.section 
        className="w-full py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Continue Learning</h2>
            <p className="text-muted-foreground">Pick up where you left off</p>
          </div>
        </div>
        <div className="text-center py-16 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-border/50">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No content yet</h3>
          <p className="text-muted-foreground mb-6">Upload, paste, or record something to get started!</p>
          <Button className="bg-primary hover:bg-primary/90">
            Add Your First Content
          </Button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      className="w-full py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Continue Learning</h2>
          <p className="text-muted-foreground">Pick up where you left off</p>
        </div>
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-foreground group"
        >
          View all
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      
      <div className="relative -mx-4 px-4">
        <Carousel className="w-full" opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: true
        }}>
          <CarouselContent className="-ml-4">
            {content.map((item, index) => (
              <CarouselItem key={item.id} className={cn(
                "pl-4",
                "basis-[300px] sm:basis-[340px] md:basis-[380px]",
                "first:pl-4"
              )}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <EnhancedLearningCard 
                    content={item} 
                    onDelete={() => onDeleteCard(item)} 
                    onShare={() => onShareCard(item)} 
                    onAddToRoom={roomId => handleAddToRoom(roomId, item)}
                    availableRooms={availableRooms}
                    currentRoom={currentRoom}
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {content.length > 1 && (
            <>
              <CarouselPrevious className={cn(
                "hidden md:flex -left-12",
                "bg-background/80 backdrop-blur-sm",
                "border-border hover:bg-accent",
                "text-foreground shadow-lg",
                "transition-all duration-200"
              )} />
              <CarouselNext className={cn(
                "hidden md:flex -right-12",
                "bg-background/80 backdrop-blur-sm",
                "border-border hover:bg-accent",
                "text-foreground shadow-lg",
                "transition-all duration-200"
              )} />
            </>
          )}
        </Carousel>
      </div>
    </motion.section>
  );
}
