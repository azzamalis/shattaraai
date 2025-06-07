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
    'onboarding.purpose': 'How do you want to use Shattara?',
    'onboarding.purposePlaceholder': "I'm here for",
    'onboarding.purpose.student': 'Student',
    'onboarding.purpose.teacher': 'Teacher',
    'onboarding.purpose.work': 'Work',
    'onboarding.goal': "What's your main personal goal with Shattara?",
    'onboarding.goalPlaceholder': 'Select your goals',
    'onboarding.source': 'How did you hear about us?',
    'onboarding.sourcePlaceholder': 'I found Shattara from',
    'onboarding.continue': 'Continue',
    'onboarding.alreadySetup': 'Already set up?',
    'onboarding.signIn': 'Sign in',
    // Goal options
    'onboarding.goals.examPrep': 'Prep for exam',
    'onboarding.goals.research': 'Conduct Research',
    'onboarding.goals.coursework': 'Get coursework assist',
    'onboarding.goals.lessonPlanning': 'Create lesson plans',
    'onboarding.goals.grading': 'Automate grading',
    'onboarding.goals.personalization': 'Personalize teaching',
    'onboarding.goals.productivity': 'Boost productivity',
    'onboarding.goals.learning': 'Learn new skills',
    'onboarding.goals.innovation': 'Drive innovation',
    // Source options
    'onboarding.sources.search': 'Search',
    'onboarding.sources.instagram': 'Instagram',
    'onboarding.sources.tiktok': 'TikTok',
    'onboarding.sources.twitter': 'Twitter/X',
    'onboarding.sources.youtube': 'YouTube',
    'onboarding.sources.onlineAd': 'Online Ad/Blog',
    'onboarding.sources.friendsFamily': 'Friends & Family'
  },
  ar: {
    'onboarding.welcome': 'أهلاً بك في شطارة AI',
    'onboarding.description': 'خبرنا عن نفسك عشان نبدأ',
    'onboarding.language': 'اللغة',
    'onboarding.selectLanguage': 'اختار اللغة',
    'onboarding.purpose': 'إيش بدك تستخدم شطارة فيه؟',
    'onboarding.purposePlaceholder': 'أنا هون عشان',
    'onboarding.purpose.student': 'طالب',
    'onboarding.purpose.teacher': 'معلم',
    'onboarding.purpose.work': 'شغل',
    'onboarding.goal': 'إيش هدفك الشخصي الأساسي مع شطارة؟',
    'onboarding.goalPlaceholder': 'اختار أهدافك',
    'onboarding.source': 'كيف سمعت عنا؟',
    'onboarding.sourcePlaceholder': 'لقيت شطارة من',
    'onboarding.continue': 'يلا نكمل',
    'onboarding.alreadySetup': 'مسجل من قبل؟',
    'onboarding.signIn': 'ادخل',
    // Goal options
    'onboarding.goals.examPrep': 'تحضير للامتحان',
    'onboarding.goals.research': 'عمل بحث',
    'onboarding.goals.coursework': 'مساعدة بالواجبات',
    'onboarding.goals.lessonPlanning': 'تحضير دروس',
    'onboarding.goals.grading': 'تصحيح أوتوماتيكي',
    'onboarding.goals.personalization': 'تعليم شخصي',
    'onboarding.goals.productivity': 'زيادة الإنتاجية',
    'onboarding.goals.learning': 'تعلم مهارات جديدة',
    'onboarding.goals.innovation': 'دفع الابتكار',
    // Source options
    'onboarding.sources.search': 'بحث',
    'onboarding.sources.instagram': 'انستغرام',
    'onboarding.sources.tiktok': 'تيك توك',
    'onboarding.sources.twitter': 'تويتر/إكس',
    'onboarding.sources.youtube': 'يوتيوب',
    'onboarding.sources.onlineAd': 'إعلان أونلاين/مدونة',
    'onboarding.sources.friendsFamily': 'أصدقاء وعائلة'
  },
  zh: {
    'onboarding.welcome': '欢迎来到 Shattara AI',
    'onboarding.description': '告诉我们关于您的信息以开始',
    'onboarding.language': '语言',
    'onboarding.selectLanguage': '选择语言',
    'onboarding.purpose': '您想如何使用 Shattara？',
    'onboarding.purposePlaceholder': '我来这里是为了',
    'onboarding.purpose.student': '学生',
    'onboarding.purpose.teacher': '教师',
    'onboarding.purpose.work': '工作',
    'onboarding.goal': '您使用 Shattara 的主要个人目标是什么？',
    'onboarding.goalPlaceholder': '选择您的目标',
    'onboarding.source': '您是如何了解我们的？',
    'onboarding.sourcePlaceholder': '我从这里发现 Shattara',
    'onboarding.continue': '继续',
    'onboarding.alreadySetup': '已经设置过了？',
    'onboarding.signIn': '登录',
    // Goal options
    'onboarding.goals.examPrep': '备考',
    'onboarding.goals.research': '进行研究',
    'onboarding.goals.coursework': '课业辅助',
    'onboarding.goals.lessonPlanning': '制定课程计划',
    'onboarding.goals.grading': '自动评分',
    'onboarding.goals.personalization': '个性化教学',
    'onboarding.goals.productivity': '提高生产力',
    'onboarding.goals.learning': '学习新技能',
    'onboarding.goals.innovation': '推动创新',
    // Source options
    'onboarding.sources.search': '搜索',
    'onboarding.sources.instagram': 'Instagram',
    'onboarding.sources.tiktok': 'TikTok',
    'onboarding.sources.twitter': 'Twitter/X',
    'onboarding.sources.youtube': 'YouTube',
    'onboarding.sources.onlineAd': '在线广告/博客',
    'onboarding.sources.friendsFamily': '朋友和家人'
  },
  es: {
    'onboarding.welcome': 'Bienvenido a Shattara AI',
    'onboarding.description': 'Cuéntanos sobre ti para comenzar',
    'onboarding.language': 'Idioma',
    'onboarding.selectLanguage': 'Seleccionar idioma',
    'onboarding.purpose': '¿Cómo quieres usar Shattara?',
    'onboarding.purposePlaceholder': 'Estoy aquí para',
    'onboarding.purpose.student': 'Estudiante',
    'onboarding.purpose.teacher': 'Profesor',
    'onboarding.purpose.work': 'Trabajo',
    'onboarding.goal': '¿Cuál es tu objetivo personal principal con Shattara?',
    'onboarding.goalPlaceholder': 'Selecciona tus objetivos',
    'onboarding.source': '¿Cómo te enteraste de nosotros?',
    'onboarding.sourcePlaceholder': 'Encontré Shattara desde',
    'onboarding.continue': 'Continuar',
    'onboarding.alreadySetup': '¿Ya configurado?',
    'onboarding.signIn': 'Iniciar sesión',
    // Goal options
    'onboarding.goals.examPrep': 'Preparar para examen',
    'onboarding.goals.research': 'Realizar investigación',
    'onboarding.goals.coursework': 'Asistencia con tareas',
    'onboarding.goals.lessonPlanning': 'Crear planes de lección',
    'onboarding.goals.grading': 'Calificación automática',
    'onboarding.goals.personalization': 'Personalizar enseñanza',
    'onboarding.goals.productivity': 'Aumentar productividad',
    'onboarding.goals.learning': 'Aprender nuevas habilidades',
    'onboarding.goals.innovation': 'Impulsar innovación',
    // Source options
    'onboarding.sources.search': 'Búsqueda',
    'onboarding.sources.instagram': 'Instagram',
    'onboarding.sources.tiktok': 'TikTok',
    'onboarding.sources.twitter': 'Twitter/X',
    'onboarding.sources.youtube': 'YouTube',
    'onboarding.sources.onlineAd': 'Anuncio en línea/Blog',
    'onboarding.sources.friendsFamily': 'Amigos y familia'
  },
  fr: {
    'onboarding.welcome': 'Bienvenue sur Shattara AI',
    'onboarding.description': 'Parlez-nous de vous pour commencer',
    'onboarding.language': 'Langue',
    'onboarding.selectLanguage': 'Sélectionner la langue',
    'onboarding.purpose': 'Comment voulez-vous utiliser Shattara ?',
    'onboarding.purposePlaceholder': 'Je suis ici pour',
    'onboarding.purpose.student': 'Étudiant',
    'onboarding.purpose.teacher': 'Enseignant',
    'onboarding.purpose.work': 'Travail',
    'onboarding.goal': 'Quel est votre objectif personnel principal avec Shattara ?',
    'onboarding.goalPlaceholder': 'Sélectionnez vos objectifs',
    'onboarding.source': 'Comment avez-vous entendu parler de nous ?',
    'onboarding.sourcePlaceholder': "J'ai trouvé Shattara depuis",
    'onboarding.continue': 'Continuer',
    'onboarding.alreadySetup': 'Déjà configuré ?',
    'onboarding.signIn': 'Se connecter',
    // Goal options
    'onboarding.goals.examPrep': 'Préparer un examen',
    'onboarding.goals.research': 'Mener des recherches',
    'onboarding.goals.coursework': 'Aide aux devoirs',
    'onboarding.goals.lessonPlanning': 'Créer des plans de cours',
    'onboarding.goals.grading': 'Notation automatique',
    'onboarding.goals.personalization': 'Personnaliser l\'enseignement',
    'onboarding.goals.productivity': 'Augmenter la productivité',
    'onboarding.goals.learning': 'Apprendre de nouvelles compétences',
    'onboarding.goals.innovation': 'Stimuler l\'innovation',
    // Source options
    'onboarding.sources.search': 'Recherche',
    'onboarding.sources.instagram': 'Instagram',
    'onboarding.sources.tiktok': 'TikTok',
    'onboarding.sources.twitter': 'Twitter/X',
    'onboarding.sources.youtube': 'YouTube',
    'onboarding.sources.onlineAd': 'Publicité en ligne/Blog',
    'onboarding.sources.friendsFamily': 'Amis et famille'
  },
  ur: {
    'onboarding.welcome': 'شطارہ AI میں خوش آمدید',
    'onboarding.description': 'اپنے بارے میں بتائیں تاکہ شروع کر سکیں',
    'onboarding.language': 'زبان',
    'onboarding.selectLanguage': 'زبان منتخب کریں',
    'onboarding.purpose': 'آپ شطارہ کو کیسے استعمال کرنا چاہتے ہیں؟',
    'onboarding.purposePlaceholder': 'میں یہاں ہوں',
    'onboarding.purpose.student': 'طالب علم',
    'onboarding.purpose.teacher': 'استاد',
    'onboarding.purpose.work': 'کام',
    'onboarding.goal': 'شطارہ کے ساتھ آپ کا بنیادی ذاتی مقصد کیا ہے؟',
    'onboarding.goalPlaceholder': 'اپنے اہداف منتخب کریں',
    'onboarding.source': 'آپ نے ہمارے بارے میں کیسے سنا؟',
    'onboarding.sourcePlaceholder': 'میں نے شطارہ یہاں سے پایا',
    'onboarding.continue': 'آگے بڑھیں',
    'onboarding.alreadySetup': 'پہلے سے سیٹ اپ ہے؟',
    'onboarding.signIn': 'سائن ان',
    // Goal options
    'onboarding.goals.examPrep': 'امتحان کی تیاری',
    'onboarding.goals.research': 'تحقیق کریں',
    'onboarding.goals.coursework': 'کورس ورک میں مدد',
    'onboarding.goals.lessonPlanning': 'سبق کی منصوبہ بندی',
    'onboarding.goals.grading': 'خودکار گریڈنگ',
    'onboarding.goals.personalization': 'ذاتی تعلیم',
    'onboarding.goals.productivity': 'پیداواری صلاحیت بڑھائیں',
    'onboarding.goals.learning': 'نئے ہنر سیکھیں',
    'onboarding.goals.innovation': 'جدت طرازی',
    // Source options
    'onboarding.sources.search': 'تلاش',
    'onboarding.sources.instagram': 'انسٹاگرام',
    'onboarding.sources.tiktok': 'ٹک ٹاک',
    'onboarding.sources.twitter': 'ٹویٹر/ایکس',
    'onboarding.sources.youtube': 'یوٹیوب',
    'onboarding.sources.onlineAd': 'آن لائن اشتہار/بلاگ',
    'onboarding.sources.friendsFamily': 'دوست اور خاندان'
  },
  hi: {
    'onboarding.welcome': 'Shattara AI में आपका स्वागत है',
    'onboarding.description': 'शुरू करने के लिए हमें अपने बारे में बताएं',
    'onboarding.language': 'भाषा',
    'onboarding.selectLanguage': 'भाषा चुनें',
    'onboarding.purpose': 'आप Shattara का उपयोग कैसे करना चाहते हैं?',
    'onboarding.purposePlaceholder': 'मैं यहाँ हूँ',
    'onboarding.purpose.student': 'छात्र',
    'onboarding.purpose.teacher': 'शिक्षक',
    'onboarding.purpose.work': 'काम',
    'onboarding.goal': 'Shattara के साथ आपका मुख्य व्यक्तिगत लक्ष्य क्या है?',
    'onboarding.goalPlaceholder': 'अपने लक्ष्य चुनें',
    'onboarding.source': 'आपने हमारे बारे में कैसे सुना?',
    'onboarding.sourcePlaceholder': 'मैंने Shattara यहाँ से पाया',
    'onboarding.continue': 'जारी रखें',
    'onboarding.alreadySetup': 'पहले से सेट अप है?',
    'onboarding.signIn': 'साइन इन करें',
    // Goal options
    'onboarding.goals.examPrep': 'परीक्षा की तैयारी',
    'onboarding.goals.research': 'अनुसंधान करें',
    'onboarding.goals.coursework': 'कोर्सवर्क सहायता',
    'onboarding.goals.lessonPlanning': 'पाठ योजना बनाएं',
    'onboarding.goals.grading': 'स्वचालित ग्रेडिंग',
    'onboarding.goals.personalization': 'व्यक्तिगत शिक्षा',
    'onboarding.goals.productivity': 'उत्पादकता बढ़ाएं',
    'onboarding.goals.learning': 'नए कौशल सीखें',
    'onboarding.goals.innovation': 'नवाचार को बढ़ावा दें',
    // Source options
    'onboarding.sources.search': 'खोज',
    'onboarding.sources.instagram': 'इंस्टाग्राम',
    'onboarding.sources.tiktok': 'टिकटॉक',
    'onboarding.sources.twitter': 'ट्विटर/एक्स',
    'onboarding.sources.youtube': 'यूट्यूब',
    'onboarding.sources.onlineAd': 'ऑनलाइन विज्ञापन/ब्लॉग',
    'onboarding.sources.friendsFamily': 'मित्र और परिवार'
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
