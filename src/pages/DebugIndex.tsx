
import React from 'react';

const DebugIndex = () => {
  console.log('DebugIndex component rendering');
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Debug Test Page</h1>
        <p className="text-center text-muted-foreground">
          This is a simplified version to test basic functionality.
        </p>
        <div className="mt-8 text-center">
          <div className="inline-block p-4 bg-card rounded-lg border">
            <p>✓ React is working</p>
            <p>✓ Tailwind CSS is working</p>
            <p>✓ Basic routing is working</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugIndex;
