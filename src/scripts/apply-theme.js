// This is a reference file to show the comprehensive theme mapping needed
// This file helps identify all the hardcoded colors that need to be replaced

const colorMappings = {
  // Background colors
  'bg-[#121212]': 'bg-background',
  'bg-[#141414]': 'bg-card',
  'bg-[#1A1A1A]': 'bg-card',
  
  // Text colors
  'text-[#FAFAFA]': 'text-foreground',
  'text-[#9A9A9A]': 'text-muted-foreground',
  'text-[#A6A6A6]': 'text-muted-foreground',
  'text-[#E3E3E3]': 'text-foreground',
  'text-[#171717]': 'text-primary-foreground',
  
  // Border colors
  'border-[#2E2E2E]': 'border-border',
  'border-[#E3E3E3]': 'border-primary',
  
  // Icon and accent colors
  'text-[#E3E3E3]': 'text-muted-foreground',
  'bg-[#E3E3E3]/10': 'bg-muted',
  'bg-[#E3E3E3]/30': 'bg-muted',
  'bg-[#E3E3E3]': 'bg-primary',
  'hover:bg-[#E3E3E3]/90': 'hover:bg-primary/90',
  
  // Form inputs
  'bg-[#121212]': 'bg-background',
  'border-[#2E2E2E]': 'border-input',
  'focus-visible:border-[#E3E3E3]': 'focus-visible:border-primary',
};

// Additional semantic mappings for better theme support
const semanticMappings = {
  // Card styles
  'card-bg': 'bg-card',
  'card-text': 'text-card-foreground',
  'card-border': 'border-border',
  
  // Muted elements (icons, secondary text)
  'muted-bg': 'bg-muted',
  'muted-text': 'text-muted-foreground',
  
  // Primary actions
  'primary-bg': 'bg-primary',
  'primary-text': 'text-primary-foreground',
  'primary-hover': 'hover:bg-primary/90',
};