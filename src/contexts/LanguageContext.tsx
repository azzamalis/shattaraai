
import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'ar' | 'zh' | 'es' | 'fr' | 'ur' | 'hi';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys and values
const translations = {
  en: {
    'onboarding.welcome': 'Welcome to Shattara AI',
    'onboarding.description': 'Tell us about yourself to get started',
    'onboarding.language': 'Language',
    'onboarding.selectLanguage': 'Select language',
    'onboarding.continue': 'Continue',
    'onboarding.alreadySetup': 'Already set up?',
    'onboarding.signIn': 'Sign in'
  },
  ar: {
    'onboarding.welcome': 'أهلاً بك في شطارة AI',
    'onboarding.description': 'خبرنا عن نفسك عشان نبدأ',
    'onboarding.language': 'اللغة',
    'onboarding.selectLanguage': 'اختار اللغة',
    'onboarding.continue': 'يلا نكمل',
    'onboarding.alreadySetup': 'مسجل من قبل؟',
    'onboarding.signIn': 'ادخل'
  },
  zh: {
    'onboarding.welcome': '欢迎来到 Shattara AI',
    'onboarding.description': '告诉我们关于您的信息以开始',
    'onboarding.language': '语言',
    'onboarding.selectLanguage': '选择语言',
    'onboarding.continue': '继续',
    'onboarding.alreadySetup': '已经设置过了？',
    'onboarding.signIn': '登录'
  },
  es: {
    'onboarding.welcome': 'Bienvenido a Shattara AI',
    'onboarding.description': 'Cuéntanos sobre ti para comenzar',
    'onboarding.language': 'Idioma',
    'onboarding.selectLanguage': 'Seleccionar idioma',
    'onboarding.continue': 'Continuar',
    'onboarding.alreadySetup': '¿Ya configurado?',
    'onboarding.signIn': 'Iniciar sesión'
  },
  fr: {
    'onboarding.welcome': 'Bienvenue sur Shattara AI',
    'onboarding.description': 'Parlez-nous de vous pour commencer',
    'onboarding.language': 'Langue',
    'onboarding.selectLanguage': 'Sélectionner la langue',
    'onboarding.continue': 'Continuer',
    'onboarding.alreadySetup': 'Déjà configuré ?',
    'onboarding.signIn': 'Se connecter'
  },
  ur: {
    'onboarding.welcome': 'شطارہ AI میں خوش آمدید',
    'onboarding.description': 'اپنے بارے میں بتائیں تاکہ شروع کر سکیں',
    'onboarding.language': 'زبان',
    'onboarding.selectLanguage': 'زبان منتخب کریں',
    'onboarding.continue': 'آگے بڑھیں',
    'onboarding.alreadySetup': 'پہلے سے سیٹ اپ ہے؟',
    'onboarding.signIn': 'سائن ان'
  },
  hi: {
    'onboarding.welcome': 'Shattara AI में आपका स्वागत है',
    'onboarding.description': 'शुरू करने के लिए हमें अपने बारे में बताएं',
    'onboarding.language': 'भाषा',
    'onboarding.selectLanguage': 'भाषा चुनें',
    'onboarding.continue': 'जारी रखें',
    'onboarding.alreadySetup': 'पहले से सेट अप है?',
    'onboarding.signIn': 'साइन इन करें'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const isRTL = language === 'ar' || language === 'ur';

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  useEffect(() => {
    // Apply RTL/LTR direction to document
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
