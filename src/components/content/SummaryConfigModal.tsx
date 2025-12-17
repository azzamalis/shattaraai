import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { TemplateCard } from './config/TemplateCard';
interface SummaryConfig {
  length: 'brief' | 'standard' | 'detailed';
  focusAreas: {
    keyPoints: boolean;
    mainTopics: boolean;
    examples: boolean;
    definitions: boolean;
    all: boolean;
  };
  format: 'bullets' | 'paragraphs';
}
interface CustomRange {
  start: number;
  end: number;
}
interface SummaryConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SummaryConfig;
  onSave: (config: SummaryConfig) => void;
}
export function SummaryConfigModal({
  open,
  onOpenChange,
  config,
  onSave
}: SummaryConfigModalProps) {
  const [localConfig, setLocalConfig] = useState<SummaryConfig>(config);
  const [customRanges, setCustomRanges] = useState<CustomRange[]>([{
    start: 0,
    end: 0
  }]);
  const maxRange = 7; // This would come from content analysis

  const templates = [{
    value: 'detailed' as const,
    title: 'Detailed Summary',
    description: 'Comprehensive summary with key points and context'
  }, {
    value: 'standard' as const,
    title: 'Cheat Sheet',
    description: 'Concise bullet points for quick reference'
  }, {
    value: 'brief' as const,
    title: 'Short Summary',
    description: 'Brief overview with essential information only'
  }];
  const handleAddRange = () => {
    setCustomRanges([...customRanges, {
      start: 0,
      end: 0
    }]);
  };
  const handleRangeChange = (index: number, field: 'start' | 'end', value: number) => {
    const newRanges = [...customRanges];
    newRanges[index][field] = value;
    setCustomRanges(newRanges);
  };
  const handleSave = () => {
    onSave(localConfig);
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Summary</DialogTitle>
          <DialogDescription>
            Select specific prompts and ranges for your summary set
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Templates</Label>
              <div className="flex flex-col gap-2">
                {templates.map(template => <TemplateCard key={template.value} title={template.title} description={template.description} selected={localConfig.length === template.value} onClick={() => setLocalConfig({
                ...localConfig,
                length: template.value
              })} />)}
              </div>

              <TemplateCard title="Add Custom Prompt" description="" selected={false} onClick={() => {}} />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Summary Range</Label>
            <div className="space-y-4">
              {customRanges.map((range, index) => <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Range {index + 1}</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor={`start-${index}`}>Start</Label>
                      <Input id={`start-${index}`} type="number" min={0} max={maxRange} value={range.start} onChange={e => handleRangeChange(index, 'start', parseInt(e.target.value) || 0)} className="p-6" />
                    </div>
                    <span className="mt-6">to</span>
                    <div className="flex-1">
                      <Label htmlFor={`end-${index}`}>End</Label>
                      <Input id={`end-${index}`} type="number" min={0} max={maxRange} value={range.end} onChange={e => handleRangeChange(index, 'end', parseInt(e.target.value) || 0)} className="p-6" />
                    </div>
                  </div>
                </div>)}

              <Button type="button" variant="outline" onClick={handleAddRange} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Range
              </Button>

              <div className="text-xs text-muted-foreground">
                Maximum range: 0 to {maxRange}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Generate 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}