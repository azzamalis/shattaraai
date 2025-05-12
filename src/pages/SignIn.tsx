
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <header className="w-full px-4 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo textColor="text-white" />
          </Link>
          <nav>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary-light text-white">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-dark-deeper border border-primary/10 p-8 rounded-2xl shadow-lg shadow-black/15">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
              <p className="text-gray-400">Log in to continue your learning</p>
            </div>
            
            <form className="space-y-5">
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
                  placeholder="Enter your password" 
                  className="bg-dark border-zinc-700 text-white"
                />
                <div className="flex justify-end">
                  <Link to="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-light text-white"
              >
                Log In
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
