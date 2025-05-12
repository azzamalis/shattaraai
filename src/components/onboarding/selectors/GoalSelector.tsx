
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getGoalOptions } from '../data/goals';
import { selectItemClasses } from '../common/SelectStyles';

interface GoalSelectorProps {
  value: string;
  onChange: (value: string) => void;
  purpose: string;
}

const GoalSelector = ({ value, onChange, purpose }: GoalSelectorProps) => {
  const goalOptions = getGoalOptions(purpose);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        What's your main personal goal with Shattara?
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
          <SelectValue placeholder="Select your goals" />
        </SelectTrigger>
        <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
          {goalOptions.map((option) => (
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

export default GoalSelector;
