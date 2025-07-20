
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useThemeSync() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  // Load theme from database when user logs in
  useEffect(() => {
    if (!user) return;

    const loadUserTheme = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('theme_preference')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('Failed to load user theme preference:', error);
          return;
        }

        // Only apply if it's light or dark, ignore system
        if (data?.theme_preference && 
            (data.theme_preference === 'light' || data.theme_preference === 'dark') && 
            data.theme_preference !== theme) {
          setTheme(data.theme_preference);
        }
      } catch (error) {
        console.warn('Error loading user theme:', error);
      }
    };

    loadUserTheme();
  }, [user, setTheme, theme]);

  // Save theme to database when it changes (and user is logged in)
  useEffect(() => {
    if (!user || !theme || (theme !== 'light' && theme !== 'dark')) return;

    const saveUserTheme = async () => {
      try {
        await supabase
          .from('profiles')
          .update({ theme_preference: theme })
          .eq('id', user.id);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    };

    // Debounce theme saves
    const timeoutId = setTimeout(saveUserTheme, 500);
    return () => clearTimeout(timeoutId);
  }, [theme, user]);
}
