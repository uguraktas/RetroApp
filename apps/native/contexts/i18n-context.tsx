import React, { createContext, useContext, useEffect, useState } from 'react';
import { changeLanguage, getCurrentLanguage, initializeI18n, getSupportedLanguages, getLanguageInfo } from '@/lib/i18n';
import i18n from '@/lib/i18n';

interface I18nContextType {
  currentLanguage: string;
  isInitialized: boolean;
  changeLanguage: (languageCode: string) => Promise<void>;
  getCurrentLanguageInfo: () => { code: string; name: string };
  supportedLanguages: Array<{ code: string; name: string }>;
  t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
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

  // Translation function with proper namespace support
  const t = (key: string, options?: any) => {
    // This will cause re-renders because it depends on currentLanguage state
    return i18n.t(key, options);
  };

  const supportedLanguages = getSupportedLanguages();

  // Recreate value object every render to ensure context subscribers re-render
  const value: I18nContextType = React.useMemo(() => ({
    currentLanguage,
    isInitialized,
    changeLanguage: changeLanguageHandler,
    getCurrentLanguageInfo,
    supportedLanguages,
    t,
  }), [currentLanguage, isInitialized]); // Dependencies that should trigger re-renders

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
