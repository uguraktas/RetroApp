import { appConfig } from "@repo/config";

let isInitialized = false;

const isEnabled = appConfig.platforms.mobile.integrations.oneSignal;

const loadOneSignal = async () => {
  if (!isEnabled) {
    return null;
  }

  const OneSignal = await import("react-native-onesignal");
  return OneSignal.default;
};

export const initializeOneSignal = async (): Promise<void> => {
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

  const OneSignal = await loadOneSignal();
  if (!OneSignal) {
    return;
  }

  OneSignal.initialize(appId);
  isInitialized = true;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  const OneSignal = await loadOneSignal();
  if (!OneSignal) {
    return false;
  }

  return OneSignal.Notifications.requestPermission(true);
};

export const setExternalUserId = async (userId: string): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  const OneSignal = await loadOneSignal();
  if (!OneSignal) {
    return;
  }

  OneSignal.login(userId);
};

export const removeExternalUserId = async (): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  const OneSignal = await loadOneSignal();
  if (!OneSignal) {
    return;
  }

  OneSignal.logout();
};

export const addTag = (key: string, value: string): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  loadOneSignal().then((OneSignal) => {
    if (OneSignal) {
      OneSignal.User.addTag(key, value);
    }
  });
};

export const addTags = (tags: Record<string, string>): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  loadOneSignal().then((OneSignal) => {
    if (OneSignal) {
      OneSignal.User.addTags(tags);
    }
  });
};

export { isEnabled as isOneSignalEnabled };
