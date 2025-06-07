
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
import { useLanguage } from '@/contexts/LanguageContext';

interface SourceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SourceSelector = ({ value, onChange }: SourceSelectorProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
      <label className="block text-sm font-medium text-white">
        {t('onboarding.source')}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full bg-dark border-zinc-700 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          <SelectValue placeholder={t('onboarding.sourcePlaceholder')} />
        </SelectTrigger>
        <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
          {sourceOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className={`${selectItemClasses} ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SourceSelector;
