import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const ONBOARDING_KEY = "onboarding_completed";

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await getItemAsync(ONBOARDING_KEY);
    return value === "true";
  } catch {
    return false;
  }
};

export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await setItemAsync(ONBOARDING_KEY, "true");
  } catch {
    throw new Error("Failed to save onboarding status");
  }
};

export const resetOnboarding = async (): Promise<void> => {
  try {
    await deleteItemAsync(ONBOARDING_KEY);
  } catch {
    throw new Error("Failed to reset onboarding status");
  }
};
