
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

  useEffect(() => {
    console.log("AuthProvider initialized - Setting up auth state listener");
    let isSubscribed = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        if (!isSubscribed) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If session exists, fetch profile only if we haven't already
        if (currentSession?.user && !profileFetchedRef.current[currentSession.user.id]) {
          // Mark that we're fetching this profile
          profileFetchedRef.current[currentSession.user.id] = true;
          
          // Use setTimeout to prevent potential deadlock
          setTimeout(() => {
            if (isSubscribed) {
              fetchProfile(currentSession.user.id);
            }
          }, 0);
        } else if (!currentSession?.user) {
          setProfile(null);
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isSubscribed) return;
      
      console.log("Got existing session:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user && !profileFetchedRef.current[currentSession.user.id]) {
        profileFetchedRef.current[currentSession.user.id] = true;
        fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      console.log("Unsubscribing from auth state changes");
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchProfile = async (userId: string) => {
    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!error && data) {
      console.log("Profile fetched:", data);
      setProfile(data);
    } else if (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    console.log("Signing in user:", email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };
  
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
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
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear our tracking ref on signout
    profileFetchedRef.current = {};
    navigate('/signin');
  };
  
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset`,
    });
    return { error };
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
