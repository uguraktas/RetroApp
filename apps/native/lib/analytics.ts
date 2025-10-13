import {
  type AppsFlyerEventParams,
  logEvent as appsFlyerLogEvent,
  setCustomerUserId as appsFlyerSetUserId,
  removeUser as oneSignalRemoveUser,
  setUser as oneSignalSetUser,
  addEmailSubscription as oneSignalAddEmail,
  type PostHogEventParams,
  identifyUser as postHogIdentifyUser,
  logEvent as postHogLogEvent,
  setRevenueCatUser,
  removeRevenueCatUser,
} from "./integrations";

type AnalyticsParams = AppsFlyerEventParams | PostHogEventParams;

type UserData = {
  userId: string;
  name?: string;
  email?: string;
  enableEmailNotifications?: boolean;
};

export const analytics = {
  logEvent: async (eventName: string, params?: AnalyticsParams) => {
    await appsFlyerLogEvent(eventName, params);
    postHogLogEvent(eventName, params);
  },

  setUserId: async (
    userId: string,
    properties?: AnalyticsParams & { name?: string; email?: string }
  ) => {
    await appsFlyerSetUserId(userId);
    postHogIdentifyUser(userId, properties);
    await oneSignalSetUser(userId, properties?.name, properties?.email);
    await setRevenueCatUser(userId);
  },

  /**
   * Set user data with email subscription
   * Use this for new registrations where user accepts notifications
   */
  setUserWithNotifications: async (userData: UserData) => {
    await appsFlyerSetUserId(userData.userId);

    const postHogProps: Record<string, string | number | boolean> = {};
    if (userData.name) {
      postHogProps.name = userData.name;
    }
    if (userData.email) {
      postHogProps.email = userData.email;
    }

    if (Object.keys(postHogProps).length > 0) {
      postHogIdentifyUser(userData.userId, postHogProps);
    }

    // Set user in OneSignal with name and email
    await oneSignalSetUser(userData.userId, userData.name, userData.email);

    // Set user in RevenueCat for subscription tracking
    await setRevenueCatUser(userData.userId);

    // Add email subscription if enabled
    if (userData.enableEmailNotifications && userData.email) {
      oneSignalAddEmail(userData.email);
    }
  },

  removeUserId: async () => {
    oneSignalRemoveUser();
    await removeRevenueCatUser();
  },
};

export const analyticsEvents = {
  signUp: "sign_up",
  login: "login",
  purchase: "purchase",
  addToCart: "add_to_cart",
  completeRegistration: "complete_registration",
  viewContent: "content_view",
} as const;
