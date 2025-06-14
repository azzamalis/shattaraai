
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { languages } from '../data/languages';
import { selectItemClasses } from '../common/SelectStyles';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  const { t, isRTL } = useLanguage();

  const handleLanguageChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
      <label className="block text-sm font-medium text-foreground">
        {t('onboarding.language')}
      </label>
      <Select value={value} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-full bg-background border-border text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
          <SelectValue placeholder={t('onboarding.selectLanguage')} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border text-popover-foreground">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.value} 
              value={lang.value} 
              className={`${selectItemClasses} ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
