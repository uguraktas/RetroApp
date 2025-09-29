export type PlatformConfig = {
  auth: {
    signupEnabled: boolean;
    googleLoginEnabled?: boolean;
    appleLoginEnabled?: boolean;
  };
  ui: {
    defaultTheme: "system" | "light" | "dark";
  };
  hasOnboarding?: boolean;
  hasAppsFlyer?: boolean;
  hasOneSignal?: boolean;
  hasPostHog?: boolean;
};

export type Locale = "en" | "tr" | "ar";

export type I18nConfig = {
  defaultLocale: Locale;
  locales: Locale[];
};

export type Config = {
  name: string;
  description: string;
  author: string;
  mail: {
    fromAddress: string;
  };
  legal: {
    termsOfServiceUrl: string;
    privacyPolicyUrl: string;
  };
  i18n: I18nConfig;
  platforms: {
    web: PlatformConfig;
    native: PlatformConfig;
  };
};
