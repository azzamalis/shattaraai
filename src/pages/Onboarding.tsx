import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('');
  const [purpose, setPurpose] = useState('');
  const [goal, setGoal] = useState('');
  const [source, setSource] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form
  useEffect(() => {
    setIsFormValid(!!language && !!purpose && !!goal && !!source);
  }, [language, purpose, goal, source]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFormValid) {
      toast.success("Onboarding complete!", {
        description: "Your preferences have been saved."
      });
      
      // Navigate to home page or dashboard after onboarding
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      toast.error("Please complete all fields", {
        description: "All fields are required to continue."
      });
    }
  };

  // Get goal options based on selected purpose
  const getGoalOptions = () => {
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

  // Languages data - top 20 languages with 2-letter initials
  const languages = [
    { value: 'en', label: 'EN English' },
    { value: 'zh', label: 'ZH Chinese (Mandarin)' },
    { value: 'hi', label: 'HI Hindi' },
    { value: 'es', label: 'ES Spanish' },
    { value: 'fr', label: 'FR French' },
    { value: 'ar', label: 'AR Arabic' },
    { value: 'bn', label: 'BN Bengali' },
    { value: 'ru', label: 'RU Russian' },
    { value: 'pt', label: 'PT Portuguese' },
    { value: 'id', label: 'ID Indonesian' },
    { value: 'ur', label: 'UR Urdu' },
    { value: 'de', label: 'DE German' },
    { value: 'ja', label: 'JA Japanese' },
    { value: 'sw', label: 'SW Swahili' },
    { value: 'tr', label: 'TR Turkish' },
    { value: 'ta', label: 'TA Tamil' },
    { value: 'ko', label: 'KO Korean' },
    { value: 'it', label: 'IT Italian' },
    { value: 'vi', label: 'VI Vietnamese' },
    { value: 'pl', label: 'PL Polish' }
  ];

  // Source options
  const sourceOptions = [
    { value: 'search', label: 'Search' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'youtube', label: 'Youtube' },
    { value: 'online-ad', label: 'Online Ad/Blog' },
    { value: 'friends-family', label: 'Friends & Family' }
  ];

  const selectItemClasses = "text-white hover:text-white hover:translate-y-[-1px] transition-all duration-200 hover:bg-primary hover:bg-opacity-90 focus:bg-primary focus:text-white focus:bg-opacity-90";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-block">
          <Logo textColor="text-white" />
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-dark-deeper rounded-xl p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome to Shattara AI</h1>
          <p className="text-gray-400">Tell us about yourself to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Language
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
                {languages.map((lang) => (
                  <SelectItem 
                    key={lang.value} 
                    value={lang.value} 
                    className={selectItemClasses}
                  >
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Purpose Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              How do you want to use Shattara?
            </label>
            <Select value={purpose} onValueChange={(value) => {
              setPurpose(value);
              setGoal(''); // Reset goal when purpose changes
            }}>
              <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
                <SelectValue placeholder="I'm here for" />
              </SelectTrigger>
              <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
                <SelectItem value="student" className={selectItemClasses}>Student</SelectItem>
                <SelectItem value="teacher" className={selectItemClasses}>Teacher</SelectItem>
                <SelectItem value="work" className={selectItemClasses}>Work</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Conditional Goal Selection */}
          {purpose && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                What's your main personal goal with Shattara?
              </label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
                  <SelectValue placeholder="Select your goals" />
                </SelectTrigger>
                <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
                  {getGoalOptions().map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className={selectItemClasses}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Source Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              How did you hear about us?
            </label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-full bg-dark border-zinc-700 text-white">
                <SelectValue placeholder="I found Shattara from" />
              </SelectTrigger>
              <SelectContent className="bg-dark-deeper border-zinc-700 text-white">
                {sourceOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className={selectItemClasses}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Continue Button */}
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-light text-white py-6 mt-8"
            disabled={!isFormValid}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Already set up? <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
