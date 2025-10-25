import { useEffect, useState } from "react";
import { appConfig } from "@repo/config";
import type { UserInfoData } from "./types";
import {
  getUserInfoData,
  hasCompletedUserInfo,
  saveUserInfoData,
  setUserInfoCompleted,
} from "./storage";

export const useUserInfo = () => {
  const [isUserInfoComplete, setIsUserInfoComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserInfoData | null>(null);

  useEffect(() => {
    const checkUserInfo = async () => {
      const isEnabled = appConfig.platforms.mobile.features.userInfo;

      // If feature is disabled, skip user info collection
      if (!isEnabled) {
        setIsUserInfoComplete(true);
        setIsLoading(false);
        return;
      }

      try {
        const completed = await hasCompletedUserInfo();
        setIsUserInfoComplete(completed);

        // Load existing user data if available
        if (completed) {
          const data = await getUserInfoData();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error checking user info status:", error);
        // On error, assume not completed
        setIsUserInfoComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserInfo();
  }, []);

  const completeUserInfo = async (data: UserInfoData) => {
    try {
      // Save user data to secure storage
      await saveUserInfoData(data);

      // Mark as completed
      await setUserInfoCompleted();

      // Update state
      setUserData(data);
      setIsUserInfoComplete(true);
    } catch (error) {
      console.error("Error completing user info:", error);
      throw error;
    }
  };

  return {
    isUserInfoComplete,
    isLoading,
    userData,
    completeUserInfo,
  };
};
