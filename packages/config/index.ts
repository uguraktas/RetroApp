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
        allowSignup: true,
        google: false,
        apple: false,
      },
      theme: "system",
    },
    mobile: {
      auth: {
        allowSignup: true,
        google: false,
        apple: false,
      },
      theme: "system",
      features: {
        onboarding: true,
      },
      integrations: {
        appsFlyer: true,
        oneSignal: true,
        postHog: true,
        revenueCat: true,
      },
    },
  },
};

export type { AppConfig as Config, I18nConfig, Locale } from "./types";

// Re-export as config for backward compatibility
export { appConfig as config };
