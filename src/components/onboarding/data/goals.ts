
// Goal options based on selected purpose
export const getGoalOptions = (purpose: string) => {
  switch (purpose) {
    case 'student':
      return [
        { value: 'exam-prep', label: 'Prep for exam' },
        { value: 'research', label: 'Conduct Research' },
        { value: 'coursework', label: 'Get coursework assist' }
      ];
    case 'teacher':
      return [
        { value: 'lesson-planning', label: 'Create lesson plans' },
        { value: 'grading', label: 'Automate grading' },
        { value: 'personalization', label: 'Personalize teaching' }
      ];
    case 'work':
      return [
        { value: 'productivity', label: 'Boost productivity' },
        { value: 'learning', label: 'Learn new skills' },
        { value: 'innovation', label: 'Drive innovation' }
      ];
    default:
      return [];
  }
};
