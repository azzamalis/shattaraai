
import React from 'react';

export function SimpleHeroSection() {
  console.log('SimpleHeroSection rendering...');
  
  try {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            Welcome to Shattara AI
          </h1>
          <p className="text-xl text-center text-gray-300 mb-12">
            Your AI-powered learning companion
          </p>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in SimpleHeroSection:', error);
    return (
      <div className="bg-red-100 text-red-900 p-8 text-center">
        <h1>Component Error</h1>
        <p>SimpleHeroSection failed to render</p>
      </div>
    );
  }
}
