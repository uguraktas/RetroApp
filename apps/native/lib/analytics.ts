import {
  type AppsFlyerEventParams,
  logEvent as appsFlyerLogEvent,
  setCustomerUserId as appsFlyerSetUserId,
  isAppsFlyerEnabled,
} from "./integrations";

export const analytics = {
  logEvent: async (eventName: string, params?: AppsFlyerEventParams) => {
    if (!isAppsFlyerEnabled) {
      return;
    }

    await appsFlyerLogEvent(eventName, params);
  },

  setUserId: async (userId: string) => {
    if (!isAppsFlyerEnabled) {
      return;
    }

    await appsFlyerSetUserId(userId);
  },
};

export const analyticsEvents = {
  signUp: "af_sign_up",
  login: "af_login",
  purchase: "af_purchase",
  addToCart: "af_add_to_cart",
  completeRegistration: "af_complete_registration",
  viewContent: "af_content_view",
} as const;
