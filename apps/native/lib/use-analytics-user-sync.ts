import { useEffect, useRef } from "react";
import { analytics } from "./analytics";

/**
 * Safely syncs user ID to analytics platforms (AppsFlyer, PostHog, OneSignal)
 *
 * - Only calls setUserId ONCE per app session per unique user ID
 * - Prevents infinite loops and redundant API calls
 * - Safe to call from multiple places (login, app layout, etc.)
 */
export const useAnalyticsUserSync = (
  userId: string | null | undefined,
  userProperties?: Record<string, unknown>
) => {
  const lastSyncedUserId = useRef<string | null>(null);
  const hasSyncedThisSession = useRef(false);

  useEffect(() => {
    // Skip if no user ID
    if (!userId) {
      return;
    }

    // Skip if we already synced this exact user ID this session
    if (
      hasSyncedThisSession.current &&
      lastSyncedUserId.current === userId
    ) {
      return;
    }

    // Sync user ID to all platforms
    const syncUserId = async () => {
      try {
        await analytics.setUserId(userId, userProperties);
        lastSyncedUserId.current = userId;
        hasSyncedThisSession.current = true;
      } catch (error) {
        console.error("Failed to sync user ID to analytics:", error);
      }
    };

    syncUserId();
  }, [userId, userProperties]);
};
