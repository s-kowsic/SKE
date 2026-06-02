import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

import enTranslations from '../translations/en.json';
import taTranslations from '../translations/ta.json';

const translations = { en: enTranslations, ta: taTranslations };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem('language');
    if (saved && ['en', 'ta'].includes(saved)) return saved;

    // 2. Check browser language
    const browserLang = navigator.language?.slice(0, 2);
    if (browserLang === 'ta') return 'ta';

    // 3. Default to English
    return 'en';
  });

  // Client-side cache for dynamic translations
  const dynamicCache = useRef(new Map());

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'ta' : 'en';
      const msg = newLang === 'ta' ? 'மொழி தமிழுக்கு மாற்றப்பட்டது' : 'Language changed to English';
      toast.success(msg, { icon: '🌐' });
      return newLang;
    });
  }, []);

  // Static translation lookup
  const t = useCallback((key) => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  }, [language]);

  // Dynamic translation via backend (Groq AI)
  const translateDynamic = useCallback(async (text, targetLang = null) => {
    const lang = targetLang || language;
    if (lang === 'en') return text; // No translation needed for English (source language)

    const cacheKey = `${lang}:${text}`;
    if (dynamicCache.current.has(cacheKey)) {
      return dynamicCache.current.get(cacheKey);
    }

    try {
      const { data } = await api.post('/translate', { text, targetLang: lang });
      dynamicCache.current.set(cacheKey, data.translated);
      return data.translated;
    } catch (error) {
      console.error('Dynamic translation failed:', error);
      return text; // Fallback to original
    }
  }, [language]);

  // Batch dynamic translation
  const translateBatch = useCallback(async (texts, targetLang = null) => {
    const lang = targetLang || language;
    if (lang === 'en') return texts;

    // Check which are cached
    const results = texts.map(text => {
      const cacheKey = `${lang}:${text}`;
      return dynamicCache.current.has(cacheKey) ? dynamicCache.current.get(cacheKey) : null;
    });

    const uncachedIndices = results.map((r, i) => r === null ? i : -1).filter(i => i !== -1);
    
    if (uncachedIndices.length === 0) return results;

    try {
      const uncachedTexts = uncachedIndices.map(i => texts[i]);
      const { data } = await api.post('/translate/batch', { texts: uncachedTexts, targetLang: lang });
      
      uncachedIndices.forEach((origIndex, i) => {
        const translated = data.translations[i] || texts[origIndex];
        results[origIndex] = translated;
        dynamicCache.current.set(`${lang}:${texts[origIndex]}`, translated);
      });

      return results;
    } catch (error) {
      console.error('Batch translation failed:', error);
      return texts;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, translateDynamic, translateBatch }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
