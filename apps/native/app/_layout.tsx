import "@/polyfills";
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import React, { useRef } from "react";
import { Platform, View } from "react-native";
import { OnboardingScreen } from "@/components/onboarding-screen";
import { I18nProvider } from "@/contexts/i18n-context";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { NAV_THEME } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useIntegrations } from "@/lib/use-integrations";
import { queryClient } from "@/utils/trpc";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export const unstableSettings = {
  initialRouteName: "sign-in",
};

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIntegrations();

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, [colorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootContent />
          </GestureHandlerRootView>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

const RootContent = () => {
  const { isOnboardingComplete, isLoading } = useOnboarding();

  if (isLoading) {
    return <View className="flex-1 bg-background" />;
  }

  if (!isOnboardingComplete) {
    return <OnboardingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
};

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
