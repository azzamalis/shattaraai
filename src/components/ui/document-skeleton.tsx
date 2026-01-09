import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export function DocumentViewerSkeleton() {
  return (
    <div className="h-full w-full flex flex-col bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl border border-primary/10 overflow-hidden">
      {/* Toolbar skeleton */}
      <div className="h-12 border-b border-primary/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
          <p className="text-sm text-muted-foreground">Loading document...</p>
        </div>
      </div>
    </div>
  );
}

export function ExamInterfaceSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header skeleton */}
      <div className="h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>
      
      {/* Progress bar skeleton */}
      <div className="px-6 py-4">
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      
      {/* Questions skeleton */}
      <div className="flex-1 px-6 py-4 space-y-6 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border rounded-xl space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <div className="space-y-2 pl-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading exam...</p>
        </div>
      </div>
    </div>
  );
}

export function ContentSidebarSkeleton() {
  return (
    <div className="h-full w-full flex flex-col p-4 space-y-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
