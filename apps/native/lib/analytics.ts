import {
  type AppsFlyerEventParams,
  logEvent as appsFlyerLogEvent,
  setCustomerUserId as appsFlyerSetUserId,
  removeExternalUserId as oneSignalRemoveUserId,
  setExternalUserId as oneSignalSetUserId,
  type PostHogEventParams,
  identifyUser as postHogIdentifyUser,
  logEvent as postHogLogEvent,
} from "./integrations";

type AnalyticsParams = AppsFlyerEventParams | PostHogEventParams;

export const analytics = {
  logEvent: async (eventName: string, params?: AnalyticsParams) => {
    await appsFlyerLogEvent(eventName, params);
    postHogLogEvent(eventName, params);
  },

  setUserId: async (userId: string, properties?: AnalyticsParams) => {
    await appsFlyerSetUserId(userId);
    postHogIdentifyUser(userId, properties);
    await oneSignalSetUserId(userId);
  },

  removeUserId: async () => {
    await oneSignalRemoveUserId();
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
