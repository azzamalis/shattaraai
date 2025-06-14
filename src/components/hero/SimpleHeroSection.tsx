
import React from 'react';

export function SimpleHeroSection() {
  console.log('SimpleHeroSection rendering...');
  
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Shattara AI
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Your AI-powered learning companion
        </p>
        <div className="text-center">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
