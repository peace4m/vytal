/**
 * VYTAL Mobile Multilingual Configuration
 * Powered by i18next and react-i18next.
 * Guarantees that language changes update ONLY user interface display text,
 * preserving all underlying clinical calculations, triage rules, and safety invariants.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import en from './locales/en.json';
import hi from './locales/hi.json';
import or from './locales/or.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import gu from './locales/gu.json';
import ur from './locales/ur.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import as from './locales/as.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';

const LANGUAGE_KEY = 'vytal_selected_language';

export interface LanguageOption {
  code: string;
  nativeLabel: string;
  englishLabel: string;
  isRTL?: boolean;
}

export const INITIAL_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeLabel: 'English', englishLabel: 'English' },
  { code: 'hi', nativeLabel: 'हिन्दी', englishLabel: 'Hindi' },
  { code: 'or', nativeLabel: 'ଓଡ଼ିଆ', englishLabel: 'Odia' },
];

export const ALL_SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Primary Initial Languages
  { code: 'en', nativeLabel: 'English', englishLabel: 'English' },
  { code: 'hi', nativeLabel: 'हिन्दी', englishLabel: 'Hindi' },
  { code: 'or', nativeLabel: 'ଓଡ଼ିଆ', englishLabel: 'Odia' },
  // Regional Indian Languages
  { code: 'bn', nativeLabel: 'বাংলা', englishLabel: 'Bengali' },
  { code: 'mr', nativeLabel: 'मराठी', englishLabel: 'Marathi' },
  { code: 'te', nativeLabel: 'తెలుగు', englishLabel: 'Telugu' },
  { code: 'ta', nativeLabel: 'தமிழ்', englishLabel: 'Tamil' },
  { code: 'gu', nativeLabel: 'ગુજરાતી', englishLabel: 'Gujarati' },
  { code: 'ur', nativeLabel: 'اردو', englishLabel: 'Urdu', isRTL: true },
  { code: 'kn', nativeLabel: 'ಕನ್ನಡ', englishLabel: 'Kannada' },
  { code: 'ml', nativeLabel: 'മലയാളം', englishLabel: 'Malayalam' },
  { code: 'pa', nativeLabel: 'ਪੰਜਾਬੀ', englishLabel: 'Punjabi' },
  { code: 'as', nativeLabel: 'অসমীয়া', englishLabel: 'Assamese' },
  // Global Languages
  { code: 'es', nativeLabel: 'Español', englishLabel: 'Spanish' },
  { code: 'fr', nativeLabel: 'Français', englishLabel: 'French' },
  { code: 'ar', nativeLabel: 'العربية', englishLabel: 'Arabic', isRTL: true },
  { code: 'de', nativeLabel: 'Deutsch', englishLabel: 'German' },
  { code: 'pt', nativeLabel: 'Português', englishLabel: 'Portuguese' },
  { code: 'zh', nativeLabel: '简体中文', englishLabel: 'Simplified Chinese' },
];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  or: { translation: or },
  bn: { translation: bn },
  mr: { translation: mr },
  te: { translation: te },
  ta: { translation: ta },
  gu: { translation: gu },
  ur: { translation: ur },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  as: { translation: as },
  es: { translation: es },
  fr: { translation: fr },
  ar: { translation: ar },
  de: { translation: de },
  pt: { translation: pt },
  zh: { translation: zh },
};

// Language persistence helper
export const savePersistedLanguage = async (code: string): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(LANGUAGE_KEY, code);
    } catch {}
    return;
  }
  try {
    await SecureStore.setItemAsync(LANGUAGE_KEY, code);
  } catch {}
};

export const getPersistedLanguage = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    try {
      return (typeof localStorage !== 'undefined' ? localStorage.getItem(LANGUAGE_KEY) : null) || 'en';
    } catch {
      return 'en';
    }
  }
  try {
    const saved = await SecureStore.getItemAsync(LANGUAGE_KEY);
    return saved || 'en';
  } catch {
    return 'en';
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ALL_SUPPORTED_LANGUAGES.map((l) => l.code),
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

// Load saved language asynchronously upon initialization
getPersistedLanguage().then((savedLang) => {
  if (savedLang && savedLang !== i18n.language) {
    i18n.changeLanguage(savedLang);
  }
});

export default i18n;
