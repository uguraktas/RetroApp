import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { initializeAppsFlyer } from "./integrations";

export const useIntegrations = () => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    if (Platform.OS === "web") {
      return;
    }

    initializeAppsFlyer();
    hasInitialized.current = true;
  }, []);
};
