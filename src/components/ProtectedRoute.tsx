
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Introduce a small delay to ensure authentication state has stabilized
  useEffect(() => {
    // Only set ready after a short delay if not loading
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Add console logs to debug the authentication state
  console.log("Protected Route - Auth State:", { 
    user: user?.email, 
    isLoading, 
    isReady,
    path: location.pathname 
  });

  if (isLoading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to signin but save the location they were trying to go to
    console.log("No user found, redirecting to signin from:", location.pathname);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};
