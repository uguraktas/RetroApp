import type { Config } from "./types";

export const config: Config = {
  name: "Your App Name",
  description: "A Full-stack starter kit for building web and mobile app",
  author: "Your Name",
  mail: {
    fromAddress: "hi@codebasehub.pro",
  },
  legal: {
    termsOfServiceUrl: "https://codebasehub.pro/terms",
    privacyPolicyUrl: "https://codebasehub.pro/privacy",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "tr", "ar"],
  },
  platforms: {
    web: {
      auth: {
        signupEnabled: true,
        googleLoginEnabled: false,
        appleLoginEnabled: false,
      },
      ui: {
        defaultTheme: "system", // light, dark, system
      },
    },
    native: {
      auth: {
        signupEnabled: true,
        googleLoginEnabled: false,
        appleLoginEnabled: false,
      },
      ui: {
        defaultTheme: "system", // light, dark, system
      },
      hasOnboarding: true,
      hasAppsFlyer: false,
      hasOneSignal: false,
      hasPostHog: false,
    },
  },
};

export type { Config, I18nConfig, Locale } from "./types";
