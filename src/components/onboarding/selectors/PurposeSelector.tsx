
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { selectItemClasses } from '../common/SelectStyles';
import { useLanguage } from '@/contexts/LanguageContext';

interface PurposeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PurposeSelector = ({ value, onChange }: PurposeSelectorProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
      <label className="block text-sm font-medium text-white">
        {t('onboarding.purpose')}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full bg-dark border-zinc-700 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          <SelectValue placeholder={t('onboarding.purposePlaceholder')} />
        </SelectTrigger>
        <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
          <SelectItem value="student" className={`${selectItemClasses} ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('onboarding.purpose.student')}
          </SelectItem>
          <SelectItem value="teacher" className={`${selectItemClasses} ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('onboarding.purpose.teacher')}
          </SelectItem>
          <SelectItem value="work" className={`${selectItemClasses} ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('onboarding.purpose.work')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PurposeSelector;
