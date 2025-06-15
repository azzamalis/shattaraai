import React from 'react';
import HeroHeader from './HeroHeader';
import HeroContent from './HeroContent';
import InfiniteTrustBar from './InfiniteTrustBar';
import EducationAnimation from './EducationAnimation';

export function HeroSection() {
  return (
    <div className="relative bg-background text-foreground overflow-hidden">
      {/* Animated Education background (absolute, covers the section, z-0) */}
      <EducationAnimation className="absolute inset-0 w-full h-full z-0 pointer-events-none" />
      {/* Keep everything else above the animated background */}
      <div className="relative z-10">
        <HeroHeader />
        <main>
          <HeroContent />
          <InfiniteTrustBar />
        </main>
      </div>
    </div>
  );
}
