import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SummaryItem {
  id: string;
  title: string;
  type: 'brief' | 'standard' | 'detailed';
  createdAt: Date;
}

interface SummaryTabPanelProps {
  summaries: SummaryItem[];
  onCreateSummary: (type: 'brief' | 'standard' | 'detailed') => void;
  onViewSummary: (summary: SummaryItem) => void;
  onDeleteSummary: (summaryId: string) => void;
  onConfigure: () => void;
  isLoading?: boolean;
  autoGenerate?: boolean;
  onAutoGenerateChange?: (value: boolean) => void;
}

const summaryTypeLabels = {
  brief: 'Short Summary',
  standard: 'Cheat Sheet',
  detailed: 'Detailed Summary',
};

const summaryTypeBadgeStyles = {
  brief: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  standard: 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  detailed: 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export function SummaryTabPanel({
  summaries,
  onCreateSummary,
  onViewSummary,
  onDeleteSummary,
  onConfigure,
  isLoading = false,
  autoGenerate = false,
  onAutoGenerateChange,
}: SummaryTabPanelProps) {
  const [selectedType, setSelectedType] = useState<'brief' | 'standard' | 'detailed'>('detailed');

  const handleCreateSummary = () => {
    onCreateSummary(selectedType);
  };

  return (
    <div className="h-[calc(100vh-165px)] overflow-y-auto md:h-[calc(100vh-120px)]">
      <div className="mx-auto mb-2 w-full max-w-3xl px-4">
        <div className="space-y-3">
          {/* Create Summary Card - matching GenerationPrompt styling */}
          <div className="bg-transparent rounded-2xl border-2 border-border p-6 shadow-sm px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Create Summary
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create summaries with custom prompts and ranges
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onConfigure} 
                  disabled={isLoading} 
                  className="rounded-full w-10 h-9"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center">
                  <Button
                    id="summary-generate-btn"
                    onClick={handleCreateSummary}
                    disabled={isLoading}
                    className="rounded-l-full rounded-r-none border-r border-background/20 bg-foreground text-background hover:bg-foreground/90 px-4 h-10"
                  >
                    <span className="max-w-32 truncate">
                      {isLoading ? 'Generating...' : summaryTypeLabels[selectedType]}
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={isLoading}
                        className="h-10 rounded-l-none rounded-r-full bg-foreground text-background hover:bg-foreground/90 px-2"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedType('brief')}>
                        Short Summary
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedType('standard')}>
                        Cheat Sheet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedType('detailed')}>
                        Detailed Summary
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-generate Toggle Card */}
          <div className="bg-transparent rounded-2xl border-2 border-border p-6 shadow-sm px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Auto-generate summary?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatically create a summary as soon as content is uploaded
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoGenerate}
                  onCheckedChange={onAutoGenerateChange}
                />
              </div>
            </div>
          </div>

          {/* My Summaries Section */}
          {summaries.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">My Summaries</h3>
              </div>
              <div className="flex flex-col gap-3">
                {summaries.map((summary) => (
                  <div
                    key={summary.id}
                    onClick={() => onViewSummary(summary)}
                    className="group cursor-pointer bg-transparent rounded-2xl border-2 border-border p-4 shadow-sm transition-all duration-200 hover:border-foreground/30 hover:bg-accent/30"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex min-w-0 items-center gap-2 text-base font-medium text-foreground">
                          <span className="truncate">{summary.title}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <div
                            className={cn(
                              'truncate rounded-full px-2 py-1 text-xs',
                              summaryTypeBadgeStyles[summary.type]
                            )}
                          >
                            {summaryTypeLabels[summary.type]}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 flex-shrink-0 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EllipsisVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewSummary(summary);
                            }}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSummary(summary.id);
                            }}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
