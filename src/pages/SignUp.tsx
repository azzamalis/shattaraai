
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <header className="w-full px-4 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo textColor="text-white" />
          </Link>
          <nav>
            <Link to="/signin">
              <Button variant="outline" className="border-white/20 text-white hover:border-primary hover:bg-primary/20">
                Log In
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-dark-deeper border border-primary/10 p-8 rounded-2xl shadow-lg shadow-black/15">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-gray-400">Start your learning journey today</p>
            </div>
            
            <form className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Enter your name" 
                  className="bg-dark border-zinc-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-dark border-zinc-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create a password" 
                  className="bg-dark border-zinc-700 text-white"
                />
                <p className="text-xs text-gray-400">Must be at least 8 characters</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-light text-white"
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/signin" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
