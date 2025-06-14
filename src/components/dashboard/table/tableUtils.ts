
import React from 'react';
import { FileText, Video, Youtube, Mic } from 'lucide-react';
import { ContentTag, ContentType } from './types';

export const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'Video':
      return React.createElement(Video, { className: "h-4 w-4" });
    case 'PDF Files':
      return React.createElement(FileText, { className: "h-4 w-4" });
    case 'Recording':
      return React.createElement(Mic, { className: "h-4 w-4" });
    case 'Youtube URL':
      return React.createElement(Youtube, { className: "h-4 w-4" });
  }
};

export const getTagColor = (tag: ContentTag) => {
  switch (tag) {
    case 'Summary':
      return 'bg-blue-500 text-white';
    case 'Notes':
      return 'bg-purple-500 text-white';
    case 'Exams':
      return 'bg-orange-500 text-white';
    case 'Flashcards':
      return 'bg-green-500 text-white';
  }
};

export const getDisplayType = (type: string): ContentType => {
  switch (type) {
    case 'video':
      return 'Video';
    case 'pdf':
      return 'PDF Files';
    case 'recording':
      return 'Recording';
    case 'youtube':
      return 'Youtube URL';
    default:
      return 'PDF Files';
  }
};
