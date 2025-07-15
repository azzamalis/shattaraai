
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  language: string;
  purpose: Database['public']['Enums']['user_purpose'] | null;
  goal: Database['public']['Enums']['user_goal'] | null;
  source: Database['public']['Enums']['user_source'] | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentLogout, setRecentLogout] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
      } else if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('Error fetching profile:', error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid blocking auth state changes
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Clear recent logout flag after 30 seconds
  useEffect(() => {
    if (recentLogout) {
      const timer = setTimeout(() => {
        setRecentLogout(false);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [recentLogout]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || ''
        }
      }
    });
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  };

  const signInWithGoogle = async () => {
    try {
      // Use current origin for redirect URL - redirect to dashboard for smart routing
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/dashboard`;
      
      console.log('Current origin:', currentOrigin);
      console.log('Initiating Google OAuth with redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Google OAuth error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
      } else {
        console.log('Google OAuth initiated successfully:', data);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error during Google OAuth:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      setRecentLogout(true);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('Logout error:', err);
      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/new-password`;
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    return { data, error };
  };

  const updateProfile = async (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  // Method to refresh profile data (useful after onboarding completion)
  const refreshProfile = () => {
    if (user) {
      fetchProfile(user.id);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    recentLogout,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  };
};
