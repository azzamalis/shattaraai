
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'The Team', href: '#team' },
  { name: 'For Teachers', href: '#teachers' },
  { name: 'The Newsletter', href: '#newsletter' },
];

const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header>
      <nav
        data-state={menuState ? 'active' : undefined}
        className="fixed z-20 w-full px-2 group">
        <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="home"
                className="flex items-center space-x-2">
                <Logo />
              </Link>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="nav-link">
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 hidden w-full lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0">
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(isScrolled && 'lg:hidden')}>
                  Login
                </Button>
                <Button
                  size="sm"
                  className={cn(isScrolled && 'lg:hidden')}>
                  Sign Up
                </Button>
                <Button
                  size="sm"
                  className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeroHeader;
