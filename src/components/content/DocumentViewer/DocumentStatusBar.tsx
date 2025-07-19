import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
export function DocumentStatusBar() {
  const {
    currentPage,
    totalPages,
    zoom,
    nextPage,
    previousPage
  } = useDocumentViewer();
  return;
}