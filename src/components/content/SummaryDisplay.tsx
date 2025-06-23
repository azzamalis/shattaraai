import React from 'react';
import { Copy, Clock, FileText, Video, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';
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
}

// Sample summary data based on content type
const getSampleSummaryData = (contentType: string): SummaryItem[] => {
  switch (contentType) {
    case 'pdf':
      return [{
        id: '1',
        reference: 'Page 15',
        title: 'Introduction to Machine Learning',
        summary: ['Machine learning is a subset of artificial intelligence that enables computers to learn without explicit programming', 'Key concepts include supervised learning, unsupervised learning, and reinforcement learning'],
        page: 15
      }, {
        id: '2',
        reference: 'Page 23',
        title: 'Neural Networks Fundamentals',
        summary: ['Neural networks are computing systems inspired by biological neural networks', 'They consist of layers of interconnected nodes that process information'],
        page: 23
      }, {
        id: '3',
        reference: 'Page 41',
        title: 'Deep Learning Applications',
        summary: ['Deep learning has revolutionized computer vision and natural language processing', 'Applications include image recognition, speech synthesis, and autonomous vehicles'],
        page: 41
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
  contentData
}: SummaryDisplayProps) {
  const summaryData = getSampleSummaryData(contentData.type);
  const ContentIcon = getContentIcon(contentData.type);
  const handleCopyAll = () => {
    const fullSummary = summaryData.map(item => `${item.title}\n${item.summary.map(point => `• ${point}`).join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(fullSummary);
    console.log('Summary copied to clipboard');
  };
  return <div className="h-full p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          
          <h2 className="text-lg font-semibold text-dashboard-text dark:text-dashboard-text">Summary</h2>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopyAll} className="border-border text-dashboard-text dark:text-dashboard-text hover:bg-accent hover:text-accent-foreground">
          <Copy className="h-4 w-4 mr-2" />
          Copy All
        </Button>
      </div>

      <div className="space-y-4">
        {summaryData.map(item => <div key={item.id} className="p-4 rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {formatReference(item, contentData.type)}
                  </Badge>
                </div>
                <h3 className="font-medium text-dashboard-text dark:text-dashboard-text text-base mb-2">
                  {item.title}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(`${item.title}\n${item.summary.map(point => `• ${point}`).join('\n')}`)} className="text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:text-dashboard-text dark:hover:text-dashboard-text">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {item.summary.map((point, index) => <div key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dashboard-text-secondary/40 dark:bg-dashboard-text-secondary/40 mt-2 shrink-0" />
                  <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm leading-relaxed">
                    {point}
                  </p>
                </div>)}
            </div>
          </div>)}
      </div>
    </div>;
}