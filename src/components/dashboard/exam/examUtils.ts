export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export interface Question {
  id: number;
  type: 'multiple-choice' | 'free-text';
  question: string;
  options?: string[];
  correctAnswer?: number;
}

export interface ExamConfig {
  topics: string[];
  contentMethod: string;
  numQuestions: number;
  examType: string;
  duration: number; // in minutes
}

export const generateQuestions = (config: ExamConfig): Question[] => {
  const multipleChoiceQuestions = [
    {
      type: 'multiple-choice',
      question: 'How does the size of a black hole affect the experience of traveling inside it?',
      options: [
        'Supermassive black holes kill instantly upon crossing the event horizon.',
        'Larger black holes have stronger tidal forces that cause immediate death.',
        'Smaller black holes kill before the event horizon; supermassive ones allow longer survival.',
        'Smaller black holes allow for longer survival due to weaker gravity effects.'
      ],
      correctAnswer: 2
    },
    {
      type: 'multiple-choice',
      question: 'What defines the event horizon of a black hole?',
      options: [
        'The region where gravitational pull is weakest and light can escape',
        'The point at which the gravitational force is equal to the escape velocity of objects',
        'The boundary beyond which nothing can escape, not even light',
        'The area surrounding a black hole where matter is drawn in but not trapped'
      ],
      correctAnswer: 2
    },
    {
      type: 'multiple-choice',
      question: 'What is the primary force responsible for the formation of stars?',
      options: [
        'Electromagnetic force',
        'Gravitational force',
        'Nuclear force',
        'Centrifugal force'
      ],
      correctAnswer: 1
    },
    {
      type: 'multiple-choice',
      question: 'Which of the following best describes nuclear fusion in stars?',
      options: [
        'The splitting of heavy nuclei into lighter ones',
        'The combining of light nuclei to form heavier ones',
        'The decay of radioactive elements',
        'The absorption of cosmic radiation'
      ],
      correctAnswer: 1
    },
    {
      type: 'multiple-choice',
      question: 'What happens to a star when it runs out of nuclear fuel?',
      options: [
        'It immediately explodes as a supernova',
        'It continues burning indefinitely',
        'It begins to collapse under its own gravity',
        'It transforms into a planet'
      ],
      correctAnswer: 2
    }
  ];

  const freeTextQuestions = [
    {
      type: 'free-text',
      question: 'Explain why the evaporation of the largest known black holes takes an extremely long time and what happens at the final stage of their evaporation.'
    },
    {
      type: 'free-text',
      question: 'Explain the difference between the event horizon and the singularity in a black hole.'
    },
    {
      type: 'free-text',
      question: 'Describe the process of nuclear fusion in stars and its role in stellar evolution.'
    },
    {
      type: 'free-text',
      question: 'Discuss the relationship between a star\'s mass and its lifecycle, including the different possible endpoints.'
    },
    {
      type: 'free-text',
      question: 'Explain how scientists can detect and study black holes despite them not emitting light.'
    }
  ];

  let finalQuestions: any[] = [];
  
  if (config.examType === 'Multiple Choice') {
    const shuffled = [...multipleChoiceQuestions].sort(() => Math.random() - 0.5);
    finalQuestions = shuffled.slice(0, Math.min(config.numQuestions, shuffled.length));
    
    while (finalQuestions.length < config.numQuestions) {
      const remaining = config.numQuestions - finalQuestions.length;
      const additionalQuestions = shuffled.slice(0, remaining);
      finalQuestions = [...finalQuestions, ...additionalQuestions];
    }
  } else if (config.examType === 'Free Writing') {
    const shuffled = [...freeTextQuestions].sort(() => Math.random() - 0.5);
    finalQuestions = shuffled.slice(0, Math.min(config.numQuestions, shuffled.length));
    
    while (finalQuestions.length < config.numQuestions) {
      const remaining = config.numQuestions - finalQuestions.length;
      const additionalQuestions = shuffled.slice(0, remaining);
      finalQuestions = [...finalQuestions, ...additionalQuestions];
    }
  } else {
    const halfQuestions = Math.ceil(config.numQuestions / 2);
    const mcQuestions = [...multipleChoiceQuestions].sort(() => Math.random() - 0.5).slice(0, halfQuestions);
    const ftQuestions = [...freeTextQuestions].sort(() => Math.random() - 0.5).slice(0, config.numQuestions - halfQuestions);
    finalQuestions = [...mcQuestions, ...ftQuestions].sort(() => Math.random() - 0.5);
  }

  return finalQuestions.slice(0, config.numQuestions).map((q, index) => ({
    ...q,
    id: index + 1,
    type: q.type as 'multiple-choice' | 'free-text'
  }));
};
