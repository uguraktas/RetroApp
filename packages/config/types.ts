export type Theme = "system" | "light" | "dark";

export type Locale = "en" | "tr" | "ar";

export type I18n = {
  default: Locale;
  locales: Record<Locale, string>; // locale code -> native name
};

export type AuthSettings = {
  allowSignup: boolean;
  google: boolean;
  apple: boolean;
};

export type WebSettings = {
  auth: AuthSettings;
  theme: Theme;
};

export type MobileSettings = {
  auth: AuthSettings;
  theme: Theme;
  features: {
    onboarding: boolean;
  };
  integrations: {
    appsFlyer: boolean;
    oneSignal: boolean;
    postHog: boolean;
    revenueCat: boolean;
  };
};

export type Platforms = {
  web: WebSettings;
  mobile: MobileSettings;
};

export type AppConfig = {
  appName: string;
  description: string;
  author: string;
  emailFrom: string;
  legal: {
    termsUrl: string;
    privacyUrl: string;
  };
  i18n: I18n;
  platforms: Platforms;
};

// Compatibility aliases for existing imports
export type Config = AppConfig;
export type I18nConfig = I18n;
export type PlatformConfig = WebSettings | MobileSettings;
