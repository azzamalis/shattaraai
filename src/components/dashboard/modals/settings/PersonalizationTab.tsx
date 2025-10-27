import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage, type LanguageCode } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { languages } from '@/components/onboarding/data/languages';

export const PersonalizationTab: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { theme, setLightTheme, setDarkTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = async (value: string) => {
    setLanguage(value as LanguageCode);
    const { error } = await updateProfile({ language: value });
    if (error) {
      toast.error('Failed to update language');
    } else {
      toast.success('Language updated');
    }
  };

  const handleThemeChange = (value: string) => {
    if (value === 'light') {
      setLightTheme();
      toast.success('Switched to light theme');
    } else if (value === 'dark') {
      setDarkTheme();
      toast.success('Switched to dark theme');
    }
  };

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Language</span>
        </div>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px] h-9 border-0 bg-transparent hover:bg-accent hover:text-accent-foreground">
            <SelectValue placeholder="Select language">
              {languages.find(l => l.value === language)?.label || 'Select language'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[110]">
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-border">
        <div className="flex items-center gap-2">
          {theme === 'light' ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">Theme</span>
        </div>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-[180px] h-9 border-0 bg-transparent hover:bg-accent hover:text-accent-foreground">
            <SelectValue placeholder="Select theme">
              {theme === 'light' ? 'Light' : 'Dark'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[110]">
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
