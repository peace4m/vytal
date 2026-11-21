import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Indian Languages
import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import orTranslation from './locales/or.json';
import bnTranslation from './locales/bn.json';
import mrTranslation from './locales/mr.json';
import teTranslation from './locales/te.json';
import taTranslation from './locales/ta.json';
import guTranslation from './locales/gu.json';
import urTranslation from './locales/ur.json';
import knTranslation from './locales/kn.json';
import mlTranslation from './locales/ml.json';
import paTranslation from './locales/pa.json';
import asTranslation from './locales/as.json';

// Global Languages
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import arTranslation from './locales/ar.json';
import deTranslation from './locales/de.json';
import ptTranslation from './locales/pt.json';
import zhTranslation from './locales/zh.json';

const resources = {
  // Indian locales
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  or: { translation: orTranslation },
  bn: { translation: bnTranslation },
  mr: { translation: mrTranslation },
  te: { translation: teTranslation },
  ta: { translation: taTranslation },
  gu: { translation: guTranslation },
  ur: { translation: urTranslation },
  kn: { translation: knTranslation },
  ml: { translation: mlTranslation },
  pa: { translation: paTranslation },
  as: { translation: asTranslation },

  // Global locales
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  ar: { translation: arTranslation },
  de: { translation: deTranslation },
  pt: { translation: ptTranslation },
  zh: { translation: zhTranslation },
};

export const SUPPORTED_LANGUAGES = [
  'en', 'hi', 'or', 'bn', 'mr', 'te', 'ta', 'gu', 'ur', 'kn', 'ml', 'pa', 'as',
  'es', 'fr', 'ar', 'de', 'pt', 'zh'
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Synchronize document lang attribute and text direction with active language
i18n.on('languageChanged', (lng) => {
  const code = lng ? lng.split('-')[0] : 'en';
  document.documentElement.lang = code;
  // Handle Right-to-Left (RTL) scripts for Arabic and Urdu
  if (code === 'ar' || code === 'ur') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
});

export default i18n;
