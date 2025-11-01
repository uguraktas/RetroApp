import { appConfig } from "@repo/config";
import arTranslations from "@repo/i18n/translations/ar.json" with {
  type: "json",
};
import enTranslations from "@repo/i18n/translations/en.json" with {
  type: "json",
};
import trTranslations from "@repo/i18n/translations/tr.json" with {
  type: "json",
};
import { getLocales } from "expo-localization";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { I18n } from "i18n-js";
import { setLanguage as setOneSignalLanguage } from "@/lib/integrations/onesignal";

// Translation files
const translations: Record<string, Record<string, unknown>> = {
  en: enTranslations,
  tr: trTranslations,
  ar: arTranslations,
};

const STORAGE_KEY = "user_language";

// Create i18n instance
const i18n = new I18n(translations);

// Helper function to get device language
const getDeviceLanguage = (): string => {
  try {
    const deviceLocales = getLocales();

    if (!deviceLocales || deviceLocales.length === 0) {
      return appConfig.i18n.default;
    }

    // Get the first device locale's language code
    const deviceLanguageCode = deviceLocales[0]?.languageCode;

    // Check if device language is supported
    if (
      deviceLanguageCode &&
      appConfig.i18n.locales[
        deviceLanguageCode as keyof typeof appConfig.i18n.locales
      ]
    ) {
      return deviceLanguageCode;
    }

    return appConfig.i18n.default;
  } catch {
    return appConfig.i18n.default;
  }
};

// Initialize language
export const initializeI18n = async () => {
  try {
    // Try to get saved language
    const savedLanguage = await getItemAsync(STORAGE_KEY);

    if (
      savedLanguage &&
      appConfig.i18n.locales[
        savedLanguage as keyof typeof appConfig.i18n.locales
      ]
    ) {
      i18n.locale = savedLanguage;
      // Set language in OneSignal
      setOneSignalLanguage(savedLanguage);
    } else {
      // Use device language or fallback to default
      const deviceLanguage = getDeviceLanguage();
      i18n.locale = deviceLanguage;
      await setItemAsync(STORAGE_KEY, deviceLanguage);
      // Set language in OneSignal
      setOneSignalLanguage(deviceLanguage);
    }
  } catch {
    i18n.locale = appConfig.i18n.default;
    // Set default language in OneSignal
    setOneSignalLanguage(appConfig.i18n.default);
  }

  i18n.enableFallback = true;
  i18n.defaultLocale = appConfig.i18n.default;
};

// Change language function
export const changeLanguage = async (languageCode: string) => {
  if (
    appConfig.i18n.locales[languageCode as keyof typeof appConfig.i18n.locales]
  ) {
    i18n.locale = languageCode;
    await setItemAsync(STORAGE_KEY, languageCode);
    // Update language in OneSignal
    setOneSignalLanguage(languageCode);
  }
};

// Get current language
export const getCurrentLanguage = () => i18n.locale;

// Get supported languages from config
export const getSupportedLanguages = () =>
  Object.entries(appConfig.i18n.locales).map(([code, name]) => ({
    code,
    name,
  }));

// Get language info for a specific language code
export const getLanguageInfo = (languageCode: string) => {
  const name =
    appConfig.i18n.locales[languageCode as keyof typeof appConfig.i18n.locales];
  return {
    code: languageCode,
    name: name || languageCode.toUpperCase(),
  };
};

export default i18n;
