import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import {
  initializeAppsFlyer,
  initializeOneSignal,
  initializePostHog,
  initializeRevenueCat,
  isOneSignalEnabled,
  requestNotificationPermission,
} from "./integrations";

export const useIntegrations = () => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    if (Platform.OS === "web") {
      return;
    }

    const initializeAll = async () => {
      initializeAppsFlyer();
      initializePostHog();
      initializeOneSignal();
      await initializeRevenueCat();

      if (isOneSignalEnabled) {
        await requestNotificationPermission();
      }

      hasInitialized.current = true;
    };

    initializeAll();
  }, []);
};
