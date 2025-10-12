import { appConfig } from "@repo/config";
import { useEffect, useState } from "react";
import { hasCompletedOnboarding } from "./storage";

export const useOnboarding = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const isEnabled = appConfig.platforms.mobile.features.onboarding;

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isEnabled) {
        setIsOnboardingComplete(true);
        setIsLoading(false);
        return;
      }

      try {
        const completed = await hasCompletedOnboarding();
        setIsOnboardingComplete(completed);
      } catch {
        setIsOnboardingComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [isEnabled]);

  return {
    isOnboardingComplete,
    isLoading,
    isEnabled,
  };
};
