import * as SecureStore from "expo-secure-store";

const EMAIL_NOTIFICATION_KEY = "notification_preferences_email";

export type NotificationPreferences = {
  emailEnabled: boolean;
};

/**
 * Get email notification preference from secure storage
 * @returns Promise<boolean> - true if email notifications are enabled
 */
export const getEmailNotificationPreference = async (): Promise<boolean> => {
  try {
    const value = await SecureStore.getItemAsync(EMAIL_NOTIFICATION_KEY);
    return value === "true";
  } catch {
    return false;
  }
};

/**
 * Set email notification preference in secure storage
 * @param enabled - true to enable, false to disable
 */
export const setEmailNotificationPreference = async (
  enabled: boolean
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(EMAIL_NOTIFICATION_KEY, String(enabled));
  } catch {
    // Silent fail
  }
};

/**
 * Clear all notification preferences from secure storage
 */
export const clearNotificationPreferences = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(EMAIL_NOTIFICATION_KEY);
  } catch {
    // Silent fail
  }
};
