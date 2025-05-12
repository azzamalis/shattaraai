
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { selectItemClasses } from '../common/SelectStyles';

interface PurposeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PurposeSelector = ({ value, onChange }: PurposeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        How do you want to use Shattara?
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
          <SelectValue placeholder="I'm here for" />
        </SelectTrigger>
        <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
          <SelectItem value="student" className={selectItemClasses}>Student</SelectItem>
          <SelectItem value="teacher" className={selectItemClasses}>Teacher</SelectItem>
          <SelectItem value="work" className={selectItemClasses}>Work</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PurposeSelector;
