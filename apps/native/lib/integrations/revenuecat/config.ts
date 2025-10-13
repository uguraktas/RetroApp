import { Platform } from "react-native";
import { appConfig } from "@repo/config";

/**
 * RevenueCat Configuration
 * Centralized configuration for RevenueCat SDK
 */

/** Check if RevenueCat is enabled in app config */
export const isEnabled = appConfig.platforms.mobile.integrations.revenueCat;

/** Get platform-specific API key */
export const getApiKey = (): string | null => {
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || null;
  }

  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || null;
  }

  return null;
};

/** Get entitlement ID for pro features */
export const getEntitlementId = (): string | null => {
  return process.env.EXPO_PUBLIC_REVENUECAT_PRO_ENTITLEMENT_ID || null;
};

/** Check if RevenueCat is properly configured */
export const isConfigured = (): boolean => {
  return isEnabled && getApiKey() !== null && getEntitlementId() !== null;
};
