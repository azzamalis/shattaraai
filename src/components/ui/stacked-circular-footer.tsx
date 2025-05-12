
import React from 'react';
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';

function StackedCircularFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-deeper text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-primary/10 p-8">
            <Logo textColor="text-white" />
          </div>
          
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <Link to="/team" className="text-gray-400 hover:text-primary transition-colors">The Team</Link>
            <Link to="/teachers" className="text-gray-400 hover:text-primary transition-colors">For Teachers</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms</Link>
            <Link to="/careers" className="text-gray-400 hover:text-primary transition-colors">Careers</Link>
            <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link>
          </nav>
          
          <div className="mb-8 flex space-x-4">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-transparent hover:bg-primary hover:border-primary">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-transparent hover:bg-primary hover:border-primary">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-transparent hover:bg-primary hover:border-primary">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-transparent hover:bg-primary hover:border-primary">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </a>
          </div>
          
          <div className="mb-8 w-full max-w-md">
            <form className="flex gap-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" className="rounded-full bg-dark-deeper border-gray-700 focus:border-primary text-white" />
              </div>
              <Button type="submit" className="rounded-full bg-primary text-white hover:bg-primary-light">
                Subscribe
              </Button>
            </form>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © {currentYear} SHATTARA — BUILT BY PEOPLE, POWERED BY MACHINES.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { StackedCircularFooter };
