import { useState, useEffect } from 'react';
import { changeLanguage, getCurrentLanguage, initializeI18n, t, getSupportedLanguages, getLanguageInfo } from '@/lib/i18n';

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeI18n();
      setCurrentLanguage(getCurrentLanguage());
      setIsInitialized(true);
    };
    
    init();
  }, []);

  const changeLanguageHandler = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  const getCurrentLanguageInfo = () => {
    return getLanguageInfo(currentLanguage);
  };

  const supportedLanguages = getSupportedLanguages();

  return {
    currentLanguage,
    isInitialized,
    changeLanguage: changeLanguageHandler,
    getCurrentLanguageInfo,
    supportedLanguages,
    t,
  };
}
