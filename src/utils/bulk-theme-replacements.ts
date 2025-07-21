// Comprehensive theme replacement mapping for all pages
// This file contains all the color mappings that need to be applied

export const bulkColorReplacements = [
  // Background colors - Cards and containers
  { from: 'bg-[#141414]', to: 'bg-card' },
  { from: 'bg-[#1A1A1A]', to: 'bg-card' },
  { from: 'bg-[#121212]', to: 'bg-background' },
  
  // Text colors - Main content
  { from: 'text-[#FAFAFA]', to: 'text-foreground' },
  { from: 'text-[#9A9A9A]', to: 'text-muted-foreground' },
  { from: 'text-[#A6A6A6]', to: 'text-muted-foreground' },
  { from: 'text-[#E3E3E3]', to: 'text-foreground' },
  { from: 'text-[#171717]', to: 'text-primary-foreground' },
  
  // Border colors
  { from: 'border-[#2E2E2E]', to: 'border-border' },
  { from: 'border-[#E3E3E3]', to: 'border-primary' },
  { from: 'border-[#E3E3E3]/30', to: 'border-primary/30' },
  
  // Icon and accent backgrounds
  { from: 'bg-[#E3E3E3]/10', to: 'bg-muted' },
  { from: 'bg-[#E3E3E3]/30', to: 'bg-muted' },
  { from: 'bg-[#E3E3E3]', to: 'bg-primary' },
  
  // Button colors
  { from: 'hover:bg-[#E3E3E3]/90', to: 'hover:bg-primary/90' },
  
  // Form input colors
  { from: 'focus-visible:border-[#E3E3E3]', to: 'focus-visible:border-primary' },
  
  // Special card foreground colors
  { from: 'text-card-foreground', to: 'text-card-foreground' }, // Already correct
];

// Apply these replacements to ensure all pages use semantic tokens