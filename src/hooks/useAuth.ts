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
      console.log('useAuth - Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        console.log('useAuth - Successfully fetched profile:', data);
        setProfile(data);
      } else if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('useAuth - Error fetching profile:', error);
      }
    } catch (error) {
      console.error('useAuth - Error fetching profile:', error);
    }
  };

  useEffect(() => {
    console.log('useAuth - Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth - Auth state changed:', event, 'Session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('useAuth - User authenticated, fetching profile');
          // Fetch user profile after a brief delay to allow for profile creation
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 100);
        } else {
          console.log('useAuth - User not authenticated, clearing profile');
          setProfile(null);
        }
        
        // Only set loading to false after we've processed the auth state
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('useAuth - Checking for existing session');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth - Existing session found:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      // Set loading to false if no session is found
      if (!session) {
        setLoading(false);
      }
    });

    return () => {
      console.log('useAuth - Cleaning up auth subscription');
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
    const redirectUrl = `${window.location.origin}/onboarding`;
    
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
    const redirectUrl = `${window.location.origin}/onboarding`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    return { data, error };
  };

  const signOut = async () => {
    setRecentLogout(true);
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/password-reset`;
    
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
