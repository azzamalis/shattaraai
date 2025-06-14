
import React, { createContext, useContext } from 'react';
import { useTheme, Theme } from '@/hooks/useTheme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  isLight: boolean;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useTheme();

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
};
