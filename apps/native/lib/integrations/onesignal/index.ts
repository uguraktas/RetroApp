import { appConfig } from "@repo/config";
import { OneSignal } from "react-native-onesignal";

let isInitialized = false;

const isEnabled = appConfig.platforms.mobile.integrations.oneSignal;

/**
 * Initialize OneSignal SDK
 * Should be called once during app startup
 */
export const initializeOneSignal = (): void => {
  if (!isEnabled) {
    return;
  }

  if (isInitialized) {
    return;
  }

  const appId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

  if (!appId) {
    return;
  }

  try {
    OneSignal.initialize(appId);
    isInitialized = true;
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Request push notification permission from user
 * @returns Promise<boolean> - true if permission granted
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  try {
    // First check if we already have permission
    const alreadyHasPermission =
      await OneSignal.Notifications.getPermissionAsync();

    if (alreadyHasPermission) {
      // Already granted, no need to request again
      return true;
    }

    // Request permission if not already granted
    return await OneSignal.Notifications.requestPermission(true);
  } catch {
    return false;
  }
};

/**
 * Check if push notification permission is currently granted
 * @returns Promise<boolean> - true if permission is granted
 */
export const hasNotificationPermission = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  try {
    return await OneSignal.Notifications.getPermissionAsync();
  } catch {
    return false;
  }
};

/**
 * Check if user is currently subscribed to push notifications
 * Checks permission, opt-in status, and subscription ID
 * @returns Promise<boolean> - true if fully subscribed
 */
export const isPushSubscribed = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  try {
    const hasPermission = await OneSignal.Notifications.getPermissionAsync();
    const isOptedIn = await OneSignal.User.pushSubscription.getOptedInAsync();
    const subscriptionId = OneSignal.User.pushSubscription.id;

    // User is subscribed if:
    // 1. Has system permission
    // 2. Is opted in
    // 3. Has a valid subscription ID (push token)
    return (
      hasPermission &&
      isOptedIn &&
      subscriptionId !== null &&
      subscriptionId !== undefined
    );
  } catch {
    return false;
  }
};

/**
 * Check if user can request notification permission
 * @returns Promise<boolean> - true if permission can be requested
 */
export const canRequestNotificationPermission = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  try {
    return await OneSignal.Notifications.canRequestPermission();
  } catch {
    return false;
  }
};

/**
 * Set user identifier and properties in OneSignal
 * @param userId - Unique user identifier
 * @param name - User's full name (optional)
 * @param email - User's email address (optional)
 */
export const setUser = async (
  userId: string,
  name?: string,
  email?: string
): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    // Set external user ID
    OneSignal.login(userId);

    // Set user properties as tags
    const tags: Record<string, string> = {};

    if (name) {
      tags.name = name;
    }

    if (email) {
      tags.email = email;
    }

    if (Object.keys(tags).length > 0) {
      OneSignal.User.addTags(tags);
    }

    // If user has granted system permission, opt them in to push subscription
    // This ensures they show as "Subscribed" in OneSignal dashboard
    const hasPermission = await OneSignal.Notifications.getPermissionAsync();
    if (hasPermission) {
      OneSignal.User.pushSubscription.optIn();
    }
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Add email subscription to OneSignal
 * @param email - User's email address
 */
export const addEmailSubscription = (email: string): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  if (!email) {
    return;
  }

  try {
    OneSignal.User.addEmail(email);
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Remove email subscription from OneSignal
 * @param email - User's email address
 */
export const removeEmailSubscription = (email: string): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  if (!email) {
    return;
  }

  try {
    console.log("🚀 ~ removeEmailSubscription ~ email:", email);
    OneSignal.User.removeEmail(email);
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Enable or disable push notifications
 * Calling optIn() will request permission if needed
 * @param enabled - true to enable, false to disable
 */
export const setPushNotificationEnabled = (enabled: boolean): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    if (enabled) {
      console.log("🚀 ~ setPushNotificationEnabled ~ enabled:", enabled);
      // optIn() will request permission if no valid push token exists
      OneSignal.User.pushSubscription.optIn();
    } else {
      console.log("🚀 ~ setPushNotificationEnabled ~ enabled:", enabled);
      // optOut() unsubscribes even if valid push token exists
      OneSignal.User.pushSubscription.optOut();
    }
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Remove user identifier from OneSignal (logout)
 */
export const removeUser = (): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    OneSignal.logout();
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Add a single tag to user
 * @param key - Tag key
 * @param value - Tag value
 */
export const addTag = (key: string, value: string): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    OneSignal.User.addTag(key, value);
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Add multiple tags to user
 * @param tags - Object with key-value pairs
 */
export const addTags = (tags: Record<string, string>): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    OneSignal.User.addTags(tags);
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

/**
 * Set user's language preference in OneSignal
 * This allows OneSignal to send notifications in the user's preferred language
 * @param languageCode - ISO 639-1 language code (e.g., 'en', 'tr', 'ar')
 */
export const setLanguage = (languageCode: string): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    OneSignal.User.setLanguage(languageCode);
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

// Backwards compatibility exports
export const setExternalUserId = async (userId: string): Promise<void> => {
  await setUser(userId);
};
export const removeExternalUserId = (): void => removeUser();

export { isEnabled as isOneSignalEnabled };
