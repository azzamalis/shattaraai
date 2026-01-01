import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage, type LanguageCode } from '@/contexts/LanguageContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { languages } from '@/components/onboarding/data/languages';
const languageEmojis: Record<string, string> = {
  en: '🇺🇸',
  ar: '🇸🇦',
  zh: '🇨🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  ur: '🇵🇰',
  hi: '🇮🇳'
};
const chatModels = [{
  value: 'auto',
  label: 'Auto'
}, {
  value: 'gpt-4',
  label: 'GPT-4'
}, {
  value: 'gemini',
  label: 'Gemini'
}];
export const PersonalizationTab: React.FC = () => {
  const {
    updateProfile
  } = useAuth();
  const {
    theme,
    setLightTheme,
    setDarkTheme
  } = useTheme();
  const {
    language,
    setLanguage
  } = useLanguage();
  const [chatModel, setChatModel] = useState('auto');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const handleLanguageChange = async (value: string) => {
    setLanguage(value as LanguageCode);
    setLanguageOpen(false);
    const {
      error
    } = await updateProfile({
      language: value
    });
    if (error) {
      toast.error('Failed to update language');
    } else {
      toast.success('Language updated');
    }
  };
  const handleThemeChange = (value: string) => {
    setThemeOpen(false);
    if (value === 'light') {
      setLightTheme();
      toast.success('Switched to light theme');
    } else if (value === 'dark') {
      setDarkTheme();
      toast.success('Switched to dark theme');
    }
  };
  const handleModelChange = (value: string) => {
    setChatModel(value);
    setModelOpen(false);
    toast.success(`Chat model set to ${chatModels.find(m => m.value === value)?.label}`);
  };
  const currentLanguage = languages.find(l => l.value === language);
  return <div className="pb-8">
      <div className="space-y-0">
        {/* Language Row */}
        <div className="flex items-center justify-between border-b border-border py-3 font-medium">
          <span className="text-sm font-medium">Language</span>
          <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{languageEmojis[language] || '🌐'}</span>
                  <span className="text-sm font-medium text-primary/70">
                    {currentLanguage?.label || 'Select'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-primary/70" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[110] w-48 bg-popover p-1 shadow-md" align="end">
              {languages.map(lang => <button key={lang.value} onClick={() => handleLanguageChange(lang.value)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                  <span>{languageEmojis[lang.value] || '🌐'}</span>
                  <span>{lang.label}</span>
                </button>)}
            </PopoverContent>
          </Popover>
        </div>

        {/* Theme Row */}
        <div className="flex items-center justify-between border-b border-border py-3 font-medium">
          <span className="text-sm font-medium">Theme</span>
          <Popover open={themeOpen} onOpenChange={setThemeOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                <div className="flex items-center gap-2">
                  {theme === 'light' ? <Sun className="h-4 w-4 text-primary/80" /> : <Moon className="h-4 w-4 text-primary/80" />}
                  <span className="text-sm font-medium capitalize text-primary/70">
                    {theme}
                  </span>
                  <ChevronDown className="h-4 w-4 text-primary/70" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[110] w-36 bg-popover p-1 shadow-md" align="end">
              <button onClick={() => handleThemeChange('light')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </button>
              <button onClick={() => handleThemeChange('dark')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Chat Model Row */}
        
      </div>
    </div>;
};