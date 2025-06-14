import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
interface HeroActionLinkProps {
  to: string;
  text: string;
}
const HeroActionLink: React.FC<HeroActionLinkProps> = ({
  to,
  text
}) => {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const [authPath, setAuthPath] = useState<string>(to);
  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in
        if (profile?.onboarding_completed) {
          // User completed onboarding, go to dashboard
          setAuthPath('/dashboard');
        } else {
          // User needs to complete onboarding
          setAuthPath('/onboarding');
        }
      } else {
        // User is not logged in, keep original path (signup)
        setAuthPath(to);
      }
    }
  }, [user, profile, loading, to]);
  return <Link to={authPath} className="hover:bg-background/5 group mx-auto flex w-fit items-center gap-4 rounded-full border border-primary/20 p-1 pl-4 shadow-md shadow-primary/5 transition-all duration-300 bg-dark/30 backdrop-blur-sm">
      <span className="text-sm text-muted-foreground ">{text}</span>
      <span className="block h-4 w-0.5 border-l bg-primary/50"></span>

      <div className="bg-primary/10 group-hover:bg-primary/20 size-6 overflow-hidden rounded-full duration-500">
        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
          <span className="flex size-6">
            <ArrowRight className="m-auto size-3 text-primary" />
          </span>
          <span className="flex size-6">
            <ArrowRight className="m-auto size-3 text-primary" />
          </span>
        </div>
      </div>
    </Link>;
};
export default HeroActionLink;