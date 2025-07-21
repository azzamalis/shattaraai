
import React from 'react';
import HeroHeader from './HeroHeader';
import HeroContent from './HeroContent';
import InfiniteTrustBar from './InfiniteTrustBar';

export function HeroSection() {
  return (
    <div className="bg-background text-foreground">
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(227,227,227,0.08)_0,rgba(227,227,227,0.02)_50%,rgba(227,227,227,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(227,227,227,0.06)_0,rgba(227,227,227,0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(227,227,227,0.04)_0,rgba(227,227,227,0.02)_80%,transparent_100%)]" />
        </div>
        <HeroContent />
        <InfiniteTrustBar />
      </main>
    </div>
  );
}
