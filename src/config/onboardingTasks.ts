export interface OnboardingTask {
  id: string;
  label: string;
  description: string;
  targetId: string;
  route: string;
  tab?: string;
  order: number;
}

export const ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: 'add_content',
    label: 'Upload your first content',
    description: 'Upload a file, paste URL or record',
    targetId: 'onboarding-upload-zone',
    route: '/dashboard',
    order: 1,
  },
  {
    id: 'summarize_content',
    label: 'Summarize content',
    description: 'Get a detailed summary with key points',
    targetId: 'summary-generate-btn',
    route: '/content',
    tab: 'summary',
    order: 2,
  },
  {
    id: 'chat_tutor',
    label: 'Ask your AI tutor',
    description: 'Breakdown your content into chat convos',
    targetId: 'chat-send-btn',
    route: '/content',
    tab: 'chat',
    order: 3,
  },
  {
    id: 'create_flashcards',
    label: 'Create flashcard sets',
    description: 'Turn your content into memory cards',
    targetId: 'flashcards-generate-btn',
    route: '/content',
    tab: 'flashcards',
    order: 4,
  },
  {
    id: 'generate_quiz',
    label: 'Generate a quiz',
    description: 'Take a quiz to test your knowledge',
    targetId: 'quiz-generate-btn',
    route: '/content',
    tab: 'exams',
    order: 5,
  },
];

export const ONBOARDING_VISIBLE_ROUTES = [
  '/dashboard',
  '/chat',
  '/content',
  '/rooms',
  '/history',
];

export const ONBOARDING_HIDDEN_ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/password-reset',
  '/new-password',
  '/onboarding',
  '/pricing',
  '/privacy',
  '/terms',
  '/contact',
  '/teachers',
  '/team',
  '/careers',
];

export const isOnboardingVisibleOnRoute = (pathname: string): boolean =>
  ONBOARDING_VISIBLE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
