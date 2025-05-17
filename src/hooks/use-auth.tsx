
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Create a ref to track if we've already fetched the profile to avoid duplicates
  const profileFetchedRef = useRef<Record<string, boolean>>({});
  // Create a ref to track auth subscription to prevent memory leaks
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    console.log("AuthProvider initialized - Setting up auth state listener");
    let isActive = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        if (!isActive) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If session exists, fetch profile only if we haven't already
        if (currentSession?.user && !profileFetchedRef.current[currentSession.user.id]) {
          // Mark that we're fetching this profile
          profileFetchedRef.current[currentSession.user.id] = true;
          
          // Use setTimeout to prevent potential deadlock
          setTimeout(() => {
            if (isActive) {
              fetchProfile(currentSession.user.id);
            }
          }, 0);
        } else if (!currentSession?.user) {
          setProfile(null);
        }
      }
    );
    
    // Save subscription reference for cleanup
    authSubscriptionRef.current = subscription;
    
    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isActive) return;
        
        console.log("Got existing session:", currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user && !profileFetchedRef.current[currentSession.user.id]) {
          profileFetchedRef.current[currentSession.user.id] = true;
          fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };
    
    checkSession();
    
    return () => {
      console.log("Cleaning up auth state listener");
      isActive = false;
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe();
        authSubscriptionRef.current = null;
      }
    };
  }, []);
  
  const fetchProfile = async (userId: string) => {
    console.log("Fetching profile for user:", userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        console.log("Profile fetched:", data);
        setProfile(data);
      } else {
        console.log("No profile found, might be a new user");
      }
    } catch (error) {
      console.error("Exception fetching profile:", error);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    console.log("Signing in user:", email);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (e) {
      console.error("Exception during sign in:", e);
      return { error: e };
    }
  };
  
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      return { error };
    } catch (e) {
      console.error("Exception during sign up:", e);
      return { error: e };
    }
  };
  
  const signOut = async () => {
    // Clear our tracking ref on signout
    profileFetchedRef.current = {};
    try {
      await supabase.auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset`,
      });
      return { error };
    } catch (e) {
      console.error("Exception during password reset:", e);
      return { error: e };
    }
  };
  
  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
