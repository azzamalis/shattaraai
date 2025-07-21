
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import SmartCTA from './SmartCTA';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm border-b border-border' : 'bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#team" className="text-foreground hover:text-primary transition-colors">The Team</a>
            <a href="#teachers" className="text-foreground hover:text-primary transition-colors">For Teachers</a>
            <a href="#newsletter" className="text-foreground hover:text-primary transition-colors">The Newsletter</a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <SmartCTA 
              type="get-started"
              className="hidden md:inline-flex"
            >
              Get Started
            </SmartCTA>
            
            {/* Mobile Menu Button */}
            <button 
              className="ml-4 p-2 md:hidden focus:outline-none focus:ring-2 focus:ring-primary rounded text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-background z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-20">
            <Logo />
            <button 
              className="p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-6 px-8 py-8">
            <a 
              href="#team" 
              className="text-xl font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              The Team
            </a>
            <a 
              href="#teachers" 
              className="text-xl font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              For Teachers
            </a>
            <a 
              href="#newsletter" 
              className="text-xl font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              The Newsletter
            </a>
            <SmartCTA 
              type="get-started"
              className="mt-4 w-full" 
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </SmartCTA>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
