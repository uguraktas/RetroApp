import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n, {
  changeLanguage,
  getCurrentLanguage,
  getLanguageInfo,
  getSupportedLanguages,
  initializeI18n,
} from "@/lib/i18n";

type LanguageInfo = { code: string; name: string };

type I18nContextType = {
  currentLanguage: string;
  isInitialized: boolean;
  changeLanguage: (languageCode: string) => Promise<void>;
  getCurrentLanguageInfo: () => LanguageInfo;
  supportedLanguages: LanguageInfo[];
  t: (key: string, options?: Record<string, unknown>) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    getCurrentLanguage()
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeI18n();
        const currentLang = getCurrentLanguage();
        setCurrentLanguage(currentLang);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  const value: I18nContextType = useMemo(() => {
    const changeLanguageHandler = async (languageCode: string) => {
      await changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
    };

    const getCurrentLanguageInfo = (): LanguageInfo =>
      getLanguageInfo(currentLanguage);

    const t = (key: string, options?: Record<string, unknown>): string =>
      i18n.t(key, options);

    const supportedLanguages = getSupportedLanguages();

    return {
      currentLanguage,
      isInitialized,
      changeLanguage: changeLanguageHandler,
      getCurrentLanguageInfo,
      supportedLanguages,
      t,
    };
  }, [currentLanguage, isInitialized]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
