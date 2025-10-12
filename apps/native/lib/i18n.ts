import { appConfig } from "@repo/config";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { I18n } from "i18n-js";
import { setLanguage as setOneSignalLanguage } from "@/lib/integrations/onesignal";

// Translation files
const translations = {
  en: {
    // Auth
    welcome_back: "Welcome back",
    create_account: "Create your account",
    sign_in_subtitle: "Enter your credentials to access your account",
    sign_up_subtitle: "Get started with your free account today",
    email_address: "Email address",
    password: "Password",
    full_name: "Full name",
    forgot_password: "Forgot password?",
    sign_in: "Sign in",
    create_account_btn: "Create account",
    signing_in: "Signing in...",
    creating_account: "Creating account...",
    continue_with_google: "Continue with Google",
    continue_with_apple: "Continue with Apple",
    or_continue_with: "OR CONTINUE WITH",
    dont_have_account: "Don't have an account?",
    already_have_account: "Already have an account?",
    secure_sign_in: "Secure sign in",
    quick_setup: "Quick setup",
    must_be_8_characters: "Must be at least 8 characters",
    terms_text: "By creating an account, you agree to our",
    terms_of_service: "Terms of Service",
    privacy_policy: "Privacy Policy",

    // Dashboard
    dashboard: "Dashboard",
    welcome_back_user: "Welcome back, {{name}}!",
    all_systems_operational: "All systems operational",
    email_address_label: "Email Address",
    full_name_label: "Full Name",
    current_theme: "Current Theme",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
    sign_out: "Sign Out",
    language: "Language",
    select_language: "Select Language",

    // Onboarding
    welcome: "Welcome",
    welcome_subtitle:
      "Discover a new way to achieve your goals with our powerful features and intuitive design.",
    features: "Features",
    features_subtitle:
      "Everything you need in one place. Track progress, set goals, and stay motivated on your journey.",
    notifications: "Notifications",
    notifications_subtitle:
      "Get timely reminders and updates to keep you on track and never miss important moments.",
    ready: "Ready",
    ready_subtitle:
      "Join thousands of users already achieving their goals. Let's begin your journey together!",
    next: "Next",
    skip: "Skip",
    getStarted: "Get Started",
  },
  tr: {
    // Auth
    welcome_back: "Tekrar hoş geldin",
    create_account: "Hesabınızı oluşturun",
    sign_in_subtitle: "Hesabınıza erişmek için bilgilerinizi girin",
    sign_up_subtitle: "Ücretsiz hesabınızla bugün başlayın",
    email_address: "E-posta adresi",
    password: "Şifre",
    full_name: "Ad soyad",
    forgot_password: "Şifremi unuttum?",
    sign_in: "Giriş yap",
    create_account_btn: "Hesap oluştur",
    signing_in: "Giriş yapılıyor...",
    creating_account: "Hesap oluşturuluyor...",
    continue_with_google: "Google ile devam et",
    continue_with_apple: "Apple ile devam et",
    or_continue_with: "VEYA ŞUNUNLA DEVAM ET",
    dont_have_account: "Hesabınız yok mu?",
    already_have_account: "Zaten hesabınız var mı?",
    secure_sign_in: "Güvenli giriş",
    quick_setup: "Hızlı kurulum",
    must_be_8_characters: "En az 8 karakter olmalı",
    terms_text: "Hesap oluşturarak kabul etmiş olursunuz",
    terms_of_service: "Kullanım Şartları",
    privacy_policy: "Gizlilik Politikası",

    // Dashboard
    dashboard: "Kontrol Paneli",
    welcome_back_user: "Tekrar hoş geldin, {{name}}!",
    all_systems_operational: "Tüm sistemler çalışıyor",
    email_address_label: "E-posta Adresi",
    full_name_label: "Ad Soyad",
    current_theme: "Mevcut Tema",
    dark_mode: "Karanlık Mod",
    light_mode: "Açık Mod",
    sign_out: "Çıkış Yap",
    language: "Dil",
    select_language: "Dil Seçin",
  },
  ar: {
    // Auth
    welcome_back: "أهلاً بعودتك",
    create_account: "إنشاء حسابك",
    sign_in_subtitle: "أدخل بياناتك للوصول إلى حسابك",
    sign_up_subtitle: "ابدأ بحسابك المجاني اليوم",
    email_address: "عنوان البريد الإلكتروني",
    password: "كلمة المرور",
    full_name: "الاسم الكامل",
    forgot_password: "نسيت كلمة المرور؟",
    sign_in: "تسجيل الدخول",
    create_account_btn: "إنشاء حساب",
    signing_in: "جارٍ تسجيل الدخول...",
    creating_account: "جارٍ إنشاء الحساب...",
    continue_with_google: "المتابعة مع جوجل",
    continue_with_apple: "المتابعة مع أبل",
    or_continue_with: "أو تابع مع",
    dont_have_account: "ليس لديك حساب؟",
    already_have_account: "لديك حساب بالفعل؟",
    secure_sign_in: "تسجيل دخول آمن",
    quick_setup: "إعداد سريع",
    must_be_8_characters: "يجب أن تكون 8 أحرف على الأقل",
    terms_text: "بإنشاء حساب، فإنك توافق على",
    terms_of_service: "شروط الخدمة",
    privacy_policy: "سياسة الخصوصية",

    // Dashboard
    dashboard: "لوحة التحكم",
    welcome_back_user: "أهلاً بعودتك، {{name}}!",
    all_systems_operational: "جميع الأنظمة تعمل",
    email_address_label: "عنوان البريد الإلكتروني",
    full_name_label: "الاسم الكامل",
    current_theme: "المظهر الحالي",
    dark_mode: "المظهر الداكن",
    light_mode: "المظهر الفاتح",
    sign_out: "تسجيل الخروج",
    language: "اللغة",
    select_language: "اختر اللغة",
  },
};

const STORAGE_KEY = "user_language";

// Create i18n instance
const i18n = new I18n(translations);

// Helper function to get device language
const getDeviceLanguage = (): string => {
  const deviceLocales = Localization.getLocales();
  const deviceLanguage =
    deviceLocales[0]?.languageCode || appConfig.i18n.default;

  // Check if device language is supported
  return appConfig.i18n.locales[
    deviceLanguage as keyof typeof appConfig.i18n.locales
  ]
    ? deviceLanguage
    : appConfig.i18n.default;
};

// Initialize language
export const initializeI18n = async () => {
  try {
    // Try to get saved language
    const savedLanguage = await SecureStore.getItemAsync(STORAGE_KEY);

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
      await SecureStore.setItemAsync(STORAGE_KEY, deviceLanguage);
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
    await SecureStore.setItemAsync(STORAGE_KEY, languageCode);
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
