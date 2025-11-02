import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';

function StackedCircularFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <Logo textColor="text-foreground" className="scale-75" />
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              © {currentYear} SHATTARA AI — Built by people, Powered by AI
            </p>
          </div>

          {/* Right Side: Navigation Links + Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <nav className="flex flex-wrap items-center gap-6">
              <Link 
                to="/careers" 
                className="text-sm text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                Careers
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                Terms of Use
              </Link>
              <Link 
                to="/privacy" 
                className="text-sm text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/contact" 
                className="text-sm text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                Contact Us
              </Link>
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-3 ml-auto">
              <a 
                href="https://linkedin.com/company/shattaraai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="https://twitter.com/shattaraai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://instagram.com/shattaraai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="https://facebook.com/shattaraai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export { StackedCircularFooter };
