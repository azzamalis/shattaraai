
import React from 'react';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-deeper text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#team" className="text-gray-400 hover:text-primary transition-colors">The Team</a></li>
              <li><a href="#careers" className="text-gray-400 hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li><a href="#teachers" className="text-gray-400 hover:text-primary transition-colors">For Teachers</a></li>
              <li><a href="#students" className="text-gray-400 hover:text-primary transition-colors">For Students</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#newsletter" className="text-gray-400 hover:text-primary transition-colors">The Newsletter</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#help" className="text-gray-400 hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#terms" className="text-gray-400 hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#cookies" className="text-gray-400 hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        {/* Social & Logo */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8 pb-4">
          <Logo textColor="text-white" />
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className="text-gray-400 hover:text-primary transition-colors duration-150"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-primary transition-colors duration-150"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-primary transition-colors duration-150"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-primary transition-colors duration-150"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs mt-6">
          © {currentYear} SHATTARA — BUILT BY PEOPLE, POWERED BY MACHINES.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
