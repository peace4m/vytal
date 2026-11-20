import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import orTranslation from './locales/or.json';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  or: { translation: orTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'or'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Synchronize document lang attribute with active language
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
