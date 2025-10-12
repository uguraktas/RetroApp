import { appConfig } from "@repo/config";
import { OneSignal } from "react-native-onesignal";

let isInitialized = false;

const isEnabled = appConfig.platforms.mobile.integrations.oneSignal;

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

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  try {
    return await OneSignal.Notifications.requestPermission(true);
  } catch {
    return false;
  }
};

export const setExternalUserId = (userId: string): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    OneSignal.login(userId);
  } catch {
    // Silent fail - OneSignal errors are logged internally
  }
};

export const removeExternalUserId = (): void => {
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

export { isEnabled as isOneSignalEnabled };
