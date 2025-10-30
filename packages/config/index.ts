import type { AppConfig } from "./types";

export const appConfig: AppConfig = {
  appName: "Your App Name",
  description: "A Full-stack starter kit for building web and mobile app",
  author: "Your Name",
  emailFrom: "hi@codebasehub.pro",
  legal: {
    termsUrl: "https://codebasehub.pro/terms",
    privacyUrl: "https://codebasehub.pro/privacy",
  },
  i18n: {
    default: "en",
    locales: {
      en: "English",
      tr: "Türkçe",
      ar: "العربية",
    },
  },
  platforms: {
    web: {
      auth: {
        allowSignup: false,
        google: false,
        apple: false,
      },
      theme: "system", //light, dark, system
    },
    mobile: {
      auth: {
        allowSignup: true,
        google: true,
        apple: true,
      },
      theme: "dark", //light, dark, system
      features: {
        onboarding: true,
        userInfo: true,
      },
      integrations: {
        appsFlyer: false,
        oneSignal: false,
        postHog: false,
        revenueCat: false,
      },
    },
  },
};

export type { AppConfig as Config, I18nConfig, Locale } from "./types";

// Re-export as config for backward compatibility
export { appConfig as config };
