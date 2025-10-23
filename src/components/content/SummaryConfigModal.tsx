import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

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

interface SummaryConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SummaryConfig;
  onSave: (config: SummaryConfig) => void;
}

export function SummaryConfigModal({ open, onOpenChange, config, onSave }: SummaryConfigModalProps) {
  const [localConfig, setLocalConfig] = useState<SummaryConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    onOpenChange(false);
  };

  const handleFocusAreaChange = (key: keyof SummaryConfig['focusAreas'], checked: boolean) => {
    setLocalConfig({
      ...localConfig,
      focusAreas: {
        ...localConfig.focusAreas,
        [key]: checked
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Summary Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Summary Length</Label>
            <RadioGroup
              value={localConfig.length}
              onValueChange={(value) => setLocalConfig({ ...localConfig, length: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brief" id="brief" />
                <label htmlFor="brief" className="text-sm">
                  <span className="font-medium">Brief</span>
                  <span className="text-muted-foreground ml-2">(100-200 words)</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <label htmlFor="standard" className="text-sm">
                  <span className="font-medium">Standard</span>
                  <span className="text-muted-foreground ml-2">(300-500 words)</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="detailed" />
                <label htmlFor="detailed" className="text-sm">
                  <span className="font-medium">Detailed</span>
                  <span className="text-muted-foreground ml-2">(500+ words)</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Focus Areas</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keyPoints"
                  checked={localConfig.focusAreas.keyPoints}
                  onCheckedChange={(checked) => handleFocusAreaChange('keyPoints', checked as boolean)}
                />
                <label htmlFor="keyPoints" className="text-sm font-medium">
                  Key Points
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mainTopics"
                  checked={localConfig.focusAreas.mainTopics}
                  onCheckedChange={(checked) => handleFocusAreaChange('mainTopics', checked as boolean)}
                />
                <label htmlFor="mainTopics" className="text-sm font-medium">
                  Main Topics
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="examples"
                  checked={localConfig.focusAreas.examples}
                  onCheckedChange={(checked) => handleFocusAreaChange('examples', checked as boolean)}
                />
                <label htmlFor="examples" className="text-sm font-medium">
                  Examples
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="definitions"
                  checked={localConfig.focusAreas.definitions}
                  onCheckedChange={(checked) => handleFocusAreaChange('definitions', checked as boolean)}
                />
                <label htmlFor="definitions" className="text-sm font-medium">
                  Definitions
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={localConfig.focusAreas.all}
                  onCheckedChange={(checked) => handleFocusAreaChange('all', checked as boolean)}
                />
                <label htmlFor="all" className="text-sm font-medium">
                  All Areas
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Output Format</Label>
            <RadioGroup
              value={localConfig.format}
              onValueChange={(value) => setLocalConfig({ ...localConfig, format: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bullets" id="bullets" />
                <label htmlFor="bullets" className="text-sm font-medium">
                  Bullet Points
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paragraphs" id="paragraphs" />
                <label htmlFor="paragraphs" className="text-sm font-medium">
                  Paragraphs
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
