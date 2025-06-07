
import { LanguageCode } from '@/contexts/LanguageContext';

// Goal options based on selected purpose - now using translation keys
export const getGoalOptions = (purpose: string) => {
  switch (purpose) {
    case 'student':
      return [
        { value: 'exam-prep', labelKey: 'onboarding.goals.examPrep' },
        { value: 'research', labelKey: 'onboarding.goals.research' },
        { value: 'coursework', labelKey: 'onboarding.goals.coursework' }
      ];
    case 'teacher':
      return [
        { value: 'lesson-planning', labelKey: 'onboarding.goals.lessonPlanning' },
        { value: 'grading', labelKey: 'onboarding.goals.grading' },
        { value: 'personalization', labelKey: 'onboarding.goals.personalization' }
      ];
    case 'work':
      return [
        { value: 'productivity', labelKey: 'onboarding.goals.productivity' },
        { value: 'learning', labelKey: 'onboarding.goals.learning' },
        { value: 'innovation', labelKey: 'onboarding.goals.innovation' }
      ];
    default:
      return [];
  }
};
