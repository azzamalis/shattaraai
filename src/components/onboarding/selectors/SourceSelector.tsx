
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sourceOptions } from '../data/sources';
import { selectItemClasses } from '../common/SelectStyles';

interface SourceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SourceSelector = ({ value, onChange }: SourceSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        How did you hear about us?
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
          <SelectValue placeholder="I found Shattara from" />
        </SelectTrigger>
        <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
          {sourceOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className={selectItemClasses}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SourceSelector;
