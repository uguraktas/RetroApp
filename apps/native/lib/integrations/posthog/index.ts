import { appConfig } from "@repo/config";

export type PostHogEventParams = Record<string, string | number | boolean>;

let postHogInstance: typeof import("posthog-react-native").default | null =
  null;
let isInitialized = false;

const isEnabled = appConfig.platforms.mobile.integrations.postHog;

const loadPostHog = async () => {
  if (!isEnabled) {
    return null;
  }

  if (postHogInstance) {
    return postHogInstance;
  }

  const PostHog = (await import("posthog-react-native")).default;
  return PostHog;
};

export const initializePostHog = async (): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (isInitialized) {
    return;
  }

  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

  if (!apiKey) {
    return;
  }

  const PostHog = await loadPostHog();
  if (!PostHog) {
    return;
  }

  postHogInstance = new PostHog(apiKey, {
    host: host || "https://us.i.posthog.com",
  });

  isInitialized = true;
};

export const logEvent = (
  eventName: string,
  eventParams?: PostHogEventParams
): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  if (!postHogInstance) {
    return;
  }

  postHogInstance.capture(eventName, eventParams);
};

export const identifyUser = (
  userId: string,
  properties?: PostHogEventParams
): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  if (!postHogInstance) {
    return;
  }

  postHogInstance.identify(userId, properties);
};

export const resetUser = (): void => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  if (!postHogInstance) {
    return;
  }

  postHogInstance.reset();
};

export const getDistinctId = (): string | null => {
  if (!isEnabled) {
    return null;
  }

  if (!isInitialized) {
    return null;
  }

  if (!postHogInstance) {
    return null;
  }

  return postHogInstance.getDistinctId();
};

export { isEnabled as isPostHogEnabled };
