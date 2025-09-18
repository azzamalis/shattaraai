
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { name: 'The Team', href: '/team' },
  { name: 'For Teachers', href: '/teachers' },
  { name: 'Contact Us', href: '/contact' },
];

const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className="relative">
      <nav
        data-state={menuState ? 'active' : undefined}
        className="fixed z-50 w-full px-2 group">
        <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', 
          isScrolled && 'bg-card/80 max-w-4xl rounded-2xl border border-border backdrop-blur-lg lg:px-5')}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                className="flex items-center space-x-2">
                <Logo textColor="text-foreground" />
              </Link>
              {/* Mobile menu toggle */}
              <button
                className="lg:hidden text-foreground"
                onClick={() => setMenuState(!menuState)}
              >
                {menuState ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="nav-link text-muted-foreground hover:text-foreground">
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Navigation */}
            {menuState && (
              <div className="absolute top-full left-0 w-full bg-card/95 backdrop-blur-lg rounded-b-xl p-4 lg:hidden z-50">
                <ul className="flex flex-col gap-4">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground block py-2"
                        onClick={() => setMenuState(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-border">
                  {!loading && !user ? (
                    <>
                      <Link to="/signin" onClick={() => setMenuState(false)}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-foreground border-border hover:border-primary hover:bg-primary/10"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMenuState(false)}>
                        <Button
                          size="sm"
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link to="/dashboard" onClick={() => setMenuState(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6 hidden w-full lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0">
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {!loading && !user ? (
                  <>
                    <Link to="/signin">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          isScrolled && 'lg:hidden',
                          'text-foreground border-border hover:border-primary hover:bg-primary/10'
                        )}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button
                        size="sm"
                        className={cn(isScrolled && 'lg:hidden', 'bg-primary text-primary-foreground hover:bg-primary/90')}>
                        Sign Up
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button
                        size="sm"
                        className={cn(isScrolled ? 'lg:inline-flex' : 'hidden', 'bg-primary text-primary-foreground hover:bg-primary/90')}>
                        Get Started
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeroHeader;
