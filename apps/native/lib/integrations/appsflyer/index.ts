import { appConfig } from "@repo/config";

export type AppsFlyerEventParams = Record<string, string | number | boolean>;

let appsFlyerInstance: typeof import("react-native-appsflyer").default | null =
  null;
let isInitialized = false;

const isEnabled = appConfig.platforms.mobile.integrations.appsFlyer;

const loadAppsFlyer = async () => {
  if (!isEnabled) {
    return null;
  }

  if (appsFlyerInstance) {
    return appsFlyerInstance;
  }

  const appsFlyer = (await import("react-native-appsflyer")).default;
  appsFlyerInstance = appsFlyer;
  return appsFlyer;
};

export const initializeAppsFlyer = async (): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (isInitialized) {
    return;
  }

  const devKey = process.env.EXPO_PUBLIC_APPSFLYER_DEV_KEY;
  const appId = process.env.EXPO_PUBLIC_APPSFLYER_APP_ID;

  if (!devKey) {
    return;
  }

  const appsFlyer = await loadAppsFlyer();
  if (!appsFlyer) {
    return;
  }

  return new Promise((resolve) => {
    appsFlyer.initSdk(
      {
        devKey,
        isDebug: false,
        appId: appId || "",
        onInstallConversionDataListener: false,
        onDeepLinkListener: false,
      },
      () => {
        isInitialized = true;
        resolve();
      },
      () => {
        resolve();
      }
    );
  });
};

export const logEvent = async (
  eventName: string,
  eventParams?: AppsFlyerEventParams
): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  const appsFlyer = await loadAppsFlyer();
  if (!appsFlyer) {
    return;
  }

  return new Promise((resolve, reject) => {
    appsFlyer.logEvent(
      eventName,
      eventParams ?? {},
      () => resolve(),
      (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

export const setCustomerUserId = async (userId: string): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  const appsFlyer = await loadAppsFlyer();
  if (!appsFlyer) {
    return;
  }

  appsFlyer.setCustomerUserId(userId, () => {
    // Callback required by SDK
  });
};

export const getAppsFlyerId = async (): Promise<string | null> => {
  if (!isEnabled) {
    return null;
  }

  if (!isInitialized) {
    return null;
  }

  const appsFlyer = await loadAppsFlyer();
  if (!appsFlyer) {
    return null;
  }

  return new Promise((resolve) => {
    appsFlyer.getAppsFlyerUID((error?: Error, uid?: string) => {
      if (error || !uid) {
        resolve(null);
      } else {
        resolve(uid);
      }
    });
  });
};

export { isEnabled as isAppsFlyerEnabled };
