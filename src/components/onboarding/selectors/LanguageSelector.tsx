
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

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Language
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.value} 
              value={lang.value} 
              className={selectItemClasses}
            >
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
