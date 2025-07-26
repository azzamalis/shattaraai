import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Define routes that should scroll to top on navigation
    const scrollToTopRoutes = ['/', '/team', '/teachers', '/contact', '/careers', '/privacy', '/terms'];
    
    if (scrollToTopRoutes.includes(pathname)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}