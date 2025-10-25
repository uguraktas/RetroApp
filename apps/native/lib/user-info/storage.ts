import {
  deleteItemAsync,
  getItemAsync,
  setItemAsync,
} from "expo-secure-store";
import type { UserInfoData } from "./types";

const USER_INFO_COMPLETED_KEY = "user_info_completed";
const USER_INFO_DATA_KEY = "user_info_data";

/**
 * Check if user has completed the user info collection flow
 */
export const hasCompletedUserInfo = async (): Promise<boolean> => {
  try {
    const value = await getItemAsync(USER_INFO_COMPLETED_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error checking user info completion:", error);
    return false;
  }
};

/**
 * Mark user info collection as completed
 */
export const setUserInfoCompleted = async (): Promise<void> => {
  try {
    await setItemAsync(USER_INFO_COMPLETED_KEY, "true");
  } catch (error) {
    console.error("Error setting user info completed:", error);
    throw error;
  }
};

/**
 * Save user info data to secure storage
 */
export const saveUserInfoData = async (data: UserInfoData): Promise<void> => {
  try {
    // Convert data to JSON string for storage
    const jsonData = JSON.stringify(data, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });

    await setItemAsync(USER_INFO_DATA_KEY, jsonData);
  } catch (error) {
    console.error("Error saving user info data:", error);
    throw error;
  }
};

/**
 * Retrieve user info data from secure storage
 */
export const getUserInfoData = async (): Promise<UserInfoData | null> => {
  try {
    const jsonData = await getItemAsync(USER_INFO_DATA_KEY);

    if (!jsonData) {
      return null;
    }

    const data = JSON.parse(jsonData, (key, value) => {
      // Convert ISO strings back to Date objects
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
      }
      return value;
    });

    return data as UserInfoData;
  } catch (error) {
    console.error("Error retrieving user info data:", error);
    return null;
  }
};

/**
 * Reset user info collection (for testing purposes)
 */
export const resetUserInfo = async (): Promise<void> => {
  try {
    await deleteItemAsync(USER_INFO_COMPLETED_KEY);
    await deleteItemAsync(USER_INFO_DATA_KEY);
  } catch (error) {
    console.error("Error resetting user info:", error);
    throw error;
  }
};
