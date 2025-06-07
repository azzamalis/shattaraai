
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
import { useLanguage } from '@/contexts/LanguageContext';

interface GoalSelectorProps {
  value: string;
  onChange: (value: string) => void;
  purpose: string;
}

const GoalSelector = ({ value, onChange, purpose }: GoalSelectorProps) => {
  const { t, isRTL } = useLanguage();
  const goalOptions = getGoalOptions(purpose);
  
  return (
    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
      <label className="block text-sm font-medium text-white">
        {t('onboarding.goal')}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full bg-dark border-zinc-700 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          <SelectValue placeholder={t('onboarding.goalPlaceholder')} />
        </SelectTrigger>
        <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
          {goalOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className={`${selectItemClasses} ${isRTL ? 'text-right' : 'text-left'}`}
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
