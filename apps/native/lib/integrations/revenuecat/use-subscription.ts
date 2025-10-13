/**
 * useSubscription Hook
 *
 * React hook for easy subscription management in components
 * Provides subscription status and paywall functionality
 *
 * @example
 * ```typescript
 * function PremiumFeature() {
 *   const { isActive, isLoading, showPaywall } = useSubscription();
 *
 *   if (isLoading) return <Loading />;
 *
 *   if (!isActive) {
 *     return <Button onPress={showPaywall}>Upgrade to Pro</Button>;
 *   }
 *
 *   return <PremiumContent />;
 * }
 * ```
 */

import { useCallback, useEffect, useState } from "react";
import type { PaywallResult, SubscriptionStatus } from "./types";
import {
  getSubscriptionStatus,
  isSubscriptionActive,
  showPaywall as displayPaywall,
  showPaywallWithOffering,
  restorePurchases,
} from "./index";

type UseSubscriptionReturn = {
  /** Whether user has active subscription */
  isActive: boolean;
  /** Full subscription status details */
  status: SubscriptionStatus | null;
  /** Whether subscription check is in progress */
  isLoading: boolean;
  /** Display default paywall */
  showPaywall: () => Promise<PaywallResult>;
  /** Display paywall with specific offering (e.g., discount) */
  showPaywallWithOffer: (offeringId: string) => Promise<PaywallResult>;
  /** Restore previous purchases */
  restore: () => Promise<boolean>;
  /** Manually refresh subscription status */
  refresh: () => Promise<void>;
};

/**
 * Hook for managing subscriptions in React components
 */
export const useSubscription = (): UseSubscriptionReturn => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subscription status
  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const [active, fullStatus] = await Promise.all([
        isSubscriptionActive(),
        getSubscriptionStatus(),
      ]);

      setIsActive(active);
      setStatus(fullStatus);
    } catch (error) {
      console.error("[useSubscription] Failed to fetch status:", error);
      setIsActive(false);
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Show paywall and refresh status after
  const showPaywall = useCallback(async (): Promise<PaywallResult> => {
    const result = await displayPaywall();

    if (result.purchased) {
      await fetchStatus();
    }

    return result;
  }, [fetchStatus]);

  // Show paywall with offering and refresh status after
  const showPaywallWithOffer = useCallback(
    async (offeringId: string): Promise<PaywallResult> => {
      const result = await showPaywallWithOffering(offeringId);

      if (result.purchased) {
        await fetchStatus();
      }

      return result;
    },
    [fetchStatus]
  );

  // Restore purchases and refresh status
  const restore = useCallback(async (): Promise<boolean> => {
    const restored = await restorePurchases();

    if (restored) {
      await fetchStatus();
    }

    return restored;
  }, [fetchStatus]);

  return {
    isActive,
    status,
    isLoading,
    showPaywall,
    showPaywallWithOffer,
    restore,
    refresh: fetchStatus,
  };
};
