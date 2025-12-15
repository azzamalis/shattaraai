import React, { useState } from 'react';
import { Copy, Clock, FileText, Video, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';
import { DetailedSummaryDisplay } from './summary/DetailedSummaryDisplay';
import CheatSheetSummaryDisplay from './summary/CheatSheetSummaryDisplay';

interface SummaryItem {
  id: string;
  reference: string;
  title: string;
  summary: string[];
  timestamp?: number;
  page?: number;
}

interface SummaryDisplayProps {
  contentData: ContentData;
  summaryData?: {
    summary: string;
    keyPoints: string[];
  } | null;
  summaryTemplate?: 'brief' | 'standard' | 'detailed';
}

// Transform AI-generated chapters to SummaryItem format
const transformChaptersToSummaryItems = (chapters: Array<{ id: string; title: string; summary?: string; }>): SummaryItem[] => {
  return chapters.map((chapter, index) => ({
    id: chapter.id,
    reference: `Section ${index + 1}`,
    title: chapter.title,
    summary: chapter.summary 
      ? chapter.summary.split(/[.!?]+/).filter(s => s.trim().length > 0).map(s => s.trim())
      : ['No summary available for this section']
  }));
};

// Get summary data - prioritize real chapters for PDF and Word documents, fallback to sample data
const getSummaryData = (contentData: ContentData): SummaryItem[] => {
  // For PDF content or Word documents (type 'file'), check if we have real AI-generated chapters
  if ((contentData.type === 'pdf' || contentData.type === 'file') && contentData.chapters && contentData.chapters.length > 0) {
    return transformChaptersToSummaryItems(contentData.chapters);
  }
  
  // Fallback to sample data for other content types or when no real chapters exist
  return getSampleSummaryData(contentData.type);
};

// Sample summary data based on content type (used as fallback)
const getSampleSummaryData = (contentType: string): SummaryItem[] => {
  switch (contentType) {
    case 'pdf':
      return [{
        id: '1',
        reference: 'Section 1',
        title: 'Processing PDF...',
        summary: ['Content is being processed by AI', 'Summary will be available shortly']
      }];
    case 'file':
      return [{
        id: '1',
        reference: 'Section 1',
        title: 'Processing Document...',
        summary: ['Content is being processed by AI', 'Summary will be available shortly']
      }];
    case 'video':
    case 'youtube':
      return [{
        id: '1',
        reference: '2:30',
        title: 'Course Introduction',
        summary: ['Overview of the complete course structure and learning objectives', 'Prerequisites and recommended background knowledge for students'],
        timestamp: 150
      }, {
        id: '2',
        reference: '8:45',
        title: 'Setting Up Development Environment',
        summary: ['Step-by-step guide to installing required software and tools', 'Configuration of IDE and project structure setup'],
        timestamp: 525
      }, {
        id: '3',
        reference: '15:20',
        title: 'First Programming Example',
        summary: ['Writing and executing your first "Hello World" program', 'Understanding basic syntax and common programming patterns'],
        timestamp: 920
      }];
    case 'recording':
      return [{
        id: '1',
        reference: '0:45',
        title: 'Meeting Opening',
        summary: ['Welcome remarks and introduction of all participants', 'Agenda overview and key discussion points to be covered'],
        timestamp: 45
      }, {
        id: '2',
        reference: '5:12',
        title: 'Project Status Update',
        summary: ['Current progress on deliverables and milestone achievements', 'Challenges faced and proposed solutions for moving forward'],
        timestamp: 312
      }, {
        id: '3',
        reference: '12:30',
        title: 'Action Items Discussion',
        summary: ['Assignment of specific tasks to team members with deadlines', 'Next meeting schedule and expected outcomes'],
        timestamp: 750
      }];
    default:
      return [{
        id: '1',
        reference: 'Section 1',
        title: 'Content Overview',
        summary: ['Main topics and key concepts covered in this content', 'Learning objectives and expected outcomes']
      }];
  }
};

const getContentIcon = (contentType: string) => {
  switch (contentType) {
    case 'pdf':
    case 'file': // Word documents
      return FileText;
    case 'video':
    case 'youtube':
      return Video;
    case 'recording':
      return Mic;
    default:
      return FileText;
  }
};

const formatReference = (item: SummaryItem, contentType: string) => {
  if (contentType === 'pdf' && item.page) {
    return `Page ${item.page}`;
  }
  if ((contentType === 'video' || contentType === 'youtube' || contentType === 'recording') && item.timestamp) {
    const minutes = Math.floor(item.timestamp / 60);
    const seconds = item.timestamp % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return item.reference;
};

export function SummaryDisplay({
  contentData,
  summaryData,
  summaryTemplate = 'detailed'
}: SummaryDisplayProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // If we have AI-generated summary data, use the appropriate display based on template
  if (summaryData && summaryData.summary) {
    // For 'standard' template, use CheatSheetSummaryDisplay
    if (summaryTemplate === 'standard') {
      return (
        <CheatSheetSummaryDisplay
          summaryContent={summaryData.summary}
          contentId={contentData.id}
        />
      );
    }
    
    // For 'detailed' template (default), use DetailedSummaryDisplay
    return (
      <DetailedSummaryDisplay
        summary={summaryData.summary}
        keyPoints={summaryData.keyPoints}
        title={contentData.title}
      />
    );
  }
  
  // Also check if content has ai_summary field
  if (contentData.ai_summary) {
    const keyPoints = Array.isArray(contentData.summary_key_points) 
      ? contentData.summary_key_points 
      : [];
    
    // For 'standard' template, use CheatSheetSummaryDisplay
    if (summaryTemplate === 'standard') {
      return (
        <CheatSheetSummaryDisplay
          summaryContent={contentData.ai_summary}
          contentId={contentData.id}
        />
      );
    }
    
    return (
      <DetailedSummaryDisplay
        summary={contentData.ai_summary}
        keyPoints={keyPoints as string[]}
        title={contentData.title}
      />
    );
  }

  // Fallback to legacy section-based display
  const summaryItems = getSummaryData(contentData);
  const ContentIcon = getContentIcon(contentData.type);
  
  // Show loading state if PDF or Word document is still processing
  const isProcessing = (contentData.type === 'pdf' || contentData.type === 'file') && contentData.processing_status === 'processing';
  
  const handleCopyAll = () => {
    const fullSummary = summaryItems.map(item => `${item.title}\n${item.summary.map(point => `• ${point}`).join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(fullSummary);
    console.log('Summary copied to clipboard');
  };
  
  const handleCopyItem = (item: SummaryItem) => {
    const itemText = `${item.title}\n${item.summary.map(point => `• ${point}`).join('\n')}`;
    navigator.clipboard.writeText(itemText);
    console.log('Item copied to clipboard');
  };
  
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-dashboard-text dark:text-dashboard-text">Summary</h2>
        {summaryItems.length > 1 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyAll}
            className="text-dashboard-text-secondary hover:text-dashboard-text"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
        )}
      </div>

      {isProcessing ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-muted rounded w-16 mb-2"></div>
              <div className="h-6 bg-muted rounded w-2/3 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {summaryItems.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative"
              onMouseEnter={() => setHoveredCard(item.id)} 
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Page/Section Reference */}
              <div className="text-xs text-primary font-medium mb-2 tracking-wide">
                {formatReference(item, contentData.type)}
              </div>
              
              {/* Section Number and Title */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-dashboard-text dark:text-dashboard-text leading-tight">
                  {index + 1}. {item.title}
                </h3>
                
                {hoveredCard === item.id && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyItem(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-dashboard-text-secondary hover:text-dashboard-text shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Summary Content */}
              <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary leading-relaxed">
                {item.summary.map((point, pointIndex) => (
                  <p key={pointIndex} className="mb-2 last:mb-0">
                    {point}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}