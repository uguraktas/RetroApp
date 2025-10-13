/**
 * RevenueCat Integration Module
 *
 * Clean, modular subscription and paywall management using RevenueCat SDK
 * Follows the same pattern as other integrations (OneSignal, PostHog, AppsFlyer)
 *
 * Features:
 * - Initialize RevenueCat with platform-specific API keys
 * - Set user ID for subscription tracking
 * - Check subscription status
 * - Display paywall (with support for discount/promo paywalls from dashboard)
 * - Restore purchases
 *
 * @see https://www.revenuecat.com/docs/getting-started/installation/expo
 */

import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesPackage,
  type PurchasesOfferings,
} from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";
import { getApiKey, getEntitlementId, isConfigured, isEnabled } from "./config";
import type {
  PaywallResult,
  PurchaseResult,
  SubscriptionStatus,
} from "./types";

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Should be called once during app startup
 *
 * @example
 * ```typescript
 * // In app initialization
 * await initializeRevenueCat();
 * ```
 */
export const initializeRevenueCat = async (): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isConfigured()) {
    console.warn(
      "[RevenueCat] Missing configuration. Please set API keys in .env file"
    );
    return;
  }

  if (isInitialized) {
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return;
  }

  try {
    // Enable debug logs in development
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    // Configure and initialize RevenueCat
    await Purchases.configure({
      apiKey,
    });

    isInitialized = true;
  } catch (error) {
    console.error("[RevenueCat] Initialization failed:", error);
  }
};

/**
 * Set user identifier for RevenueCat
 * Call this after user authentication to track subscriptions per user
 *
 * @param userId - Unique user identifier from your auth system
 *
 * @example
 * ```typescript
 * // After user logs in
 * await setRevenueCatUser("user_123");
 * ```
 */
export const setRevenueCatUser = async (userId: string): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  if (!userId) {
    return;
  }

  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error("[RevenueCat] Failed to set user:", error);
  }
};

/**
 * Remove user identifier from RevenueCat (logout)
 * Call this when user logs out
 *
 * @example
 * ```typescript
 * // On user logout
 * await removeRevenueCatUser();
 * ```
 */
export const removeRevenueCatUser = async (): Promise<void> => {
  if (!isEnabled) {
    return;
  }

  if (!isInitialized) {
    return;
  }

  try {
    await Purchases.logOut();
  } catch (error) {
    console.error("[RevenueCat] Failed to remove user:", error);
  }
};

/**
 * Get current customer info from RevenueCat
 * Internal helper function
 */
const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  if (!isInitialized) {
    return null;
  }

  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error("[RevenueCat] Failed to get customer info:", error);
    return null;
  }
};

/**
 * Check if user has an active subscription
 * Simple boolean check for most use cases
 *
 * @returns Promise<boolean> - true if user has active subscription
 *
 * @example
 * ```typescript
 * const isSubscribed = await isSubscriptionActive();
 * if (isSubscribed) {
 *   // Show premium features
 * }
 * ```
 */
export const isSubscriptionActive = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  const entitlementId = getEntitlementId();
  if (!entitlementId) {
    return false;
  }

  const customerInfo = await getCustomerInfo();
  if (!customerInfo) {
    return false;
  }

  // Check if user has active entitlement
  const entitlement = customerInfo.entitlements.active[entitlementId];
  return entitlement !== undefined && entitlement !== null;
};

/**
 * Get detailed subscription status
 * Provides comprehensive subscription information
 *
 * @returns Promise<SubscriptionStatus> - Detailed subscription status
 *
 * @example
 * ```typescript
 * const status = await getSubscriptionStatus();
 * if (status.isActive) {
 *   console.log(`Subscription expires: ${status.expirationDate}`);
 *   console.log(`Will renew: ${status.willRenew}`);
 * }
 * ```
 */
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const defaultStatus: SubscriptionStatus = {
    isActive: false,
    isInTrial: false,
    expirationDate: null,
    willRenew: false,
    entitlementId: null,
  };

  if (!isEnabled) {
    return defaultStatus;
  }

  if (!isInitialized) {
    return defaultStatus;
  }

  const entitlementId = getEntitlementId();
  if (!entitlementId) {
    return defaultStatus;
  }

  const customerInfo = await getCustomerInfo();
  if (!customerInfo) {
    return defaultStatus;
  }

  const entitlement = customerInfo.entitlements.active[entitlementId];

  if (!entitlement) {
    return defaultStatus;
  }

  return {
    isActive: true,
    isInTrial: entitlement.periodType === "TRIAL",
    expirationDate: entitlement.expirationDate
      ? new Date(entitlement.expirationDate)
      : null,
    willRenew: entitlement.willRenew,
    entitlementId,
  };
};

/**
 * Display paywall to user
 * Shows the paywall configured in RevenueCat dashboard
 * Supports dynamic paywalls (e.g., discount/promo paywalls)
 *
 * @returns Promise<PaywallResult> - Result of paywall interaction
 *
 * @example
 * ```typescript
 * // Show default paywall
 * const result = await showPaywall();
 * if (result.purchased) {
 *   // User completed purchase
 * }
 * ```
 */
export const showPaywall = async (): Promise<PaywallResult> => {
  if (!isEnabled) {
    return { purchased: false, cancelled: true, error: "RevenueCat disabled" };
  }

  if (!isInitialized) {
    return {
      purchased: false,
      cancelled: true,
      error: "RevenueCat not initialized",
    };
  }

  try {
    // RevenueCatUI automatically handles:
    // - Displaying paywall from dashboard
    // - Processing purchases
    // - Handling errors
    // - Dismissal
    const paywallResult = await RevenueCatUI.presentPaywall();

    return {
      purchased: paywallResult === "PURCHASED" || paywallResult === "RESTORED",
      cancelled: paywallResult === "CANCELLED" || paywallResult === "ERROR",
      error:
        paywallResult === "ERROR" ? "Failed to complete purchase" : undefined,
    };
  } catch (error) {
    console.error("[RevenueCat] Paywall error:", error);
    return {
      purchased: false,
      cancelled: true,
      error:
        error instanceof Error ? error.message : "Unknown paywall error",
    };
  }
};

/**
 * Display paywall with a specific offering
 * Useful for showing discount/promo paywalls
 *
 * @param offeringId - Offering identifier from RevenueCat dashboard
 * @returns Promise<PaywallResult> - Result of paywall interaction
 *
 * @example
 * ```typescript
 * // Show discount paywall
 * const result = await showPaywallWithOffering("summer_discount");
 * ```
 */
export const showPaywallWithOffering = async (
  offeringId: string
): Promise<PaywallResult> => {
  if (!isEnabled) {
    return { purchased: false, cancelled: true, error: "RevenueCat disabled" };
  }

  if (!isInitialized) {
    return {
      purchased: false,
      cancelled: true,
      error: "RevenueCat not initialized",
    };
  }

  if (!offeringId) {
    return {
      purchased: false,
      cancelled: true,
      error: "Offering ID required",
    };
  }

  try {
    // Get offerings to find the specific one
    const offerings = await Purchases.getOfferings();
    const offering = offerings.all[offeringId];

    if (!offering) {
      return {
        purchased: false,
        cancelled: true,
        error: `Offering '${offeringId}' not found`,
      };
    }

    const paywallResult = await RevenueCatUI.presentPaywall({
      offering,
    });

    return {
      purchased: paywallResult === "PURCHASED" || paywallResult === "RESTORED",
      cancelled: paywallResult === "CANCELLED" || paywallResult === "ERROR",
      error:
        paywallResult === "ERROR" ? "Failed to complete purchase" : undefined,
    };
  } catch (error) {
    console.error("[RevenueCat] Paywall error:", error);
    return {
      purchased: false,
      cancelled: true,
      error:
        error instanceof Error ? error.message : "Unknown paywall error",
    };
  }
};

/**
 * Manually purchase a specific package
 * Alternative to showing paywall - useful for custom UI
 *
 * @param pkg - RevenueCat package to purchase
 * @returns Promise<PurchaseResult> - Result of purchase attempt
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<PurchaseResult> => {
  if (!isEnabled) {
    return {
      success: false,
      userCancelled: false,
      error: "RevenueCat disabled",
    };
  }

  if (!isInitialized) {
    return {
      success: false,
      userCancelled: false,
      error: "RevenueCat not initialized",
    };
  }

  try {
    await Purchases.purchasePackage(pkg);
    return { success: true, userCancelled: false };
  } catch (error) {
    const errorObj = error as { userCancelled?: boolean; message?: string };

    return {
      success: false,
      userCancelled: errorObj.userCancelled || false,
      error: errorObj.message || "Purchase failed",
    };
  }
};

/**
 * Restore previous purchases
 * Call this to restore purchases on a new device or after reinstall
 *
 * @returns Promise<boolean> - true if restore was successful
 *
 * @example
 * ```typescript
 * const restored = await restorePurchases();
 * if (restored) {
 *   // Purchases restored successfully
 * }
 * ```
 */
export const restorePurchases = async (): Promise<boolean> => {
  if (!isEnabled) {
    return false;
  }

  if (!isInitialized) {
    return false;
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const entitlementId = getEntitlementId();

    if (!entitlementId) {
      return false;
    }

    // Check if user has active entitlement after restore
    const hasActiveEntitlement =
      customerInfo.entitlements.active[entitlementId] !== undefined;

    return hasActiveEntitlement;
  } catch (error) {
    console.error("[RevenueCat] Restore failed:", error);
    return false;
  }
};

/**
 * Get current offerings from RevenueCat
 * Useful for building custom paywall UI
 *
 * @returns Promise<PurchasesOfferings | null> - Available offerings or null
 */
export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  if (!isEnabled) {
    return null;
  }

  if (!isInitialized) {
    return null;
  }

  try {
    return await Purchases.getOfferings();
  } catch (error) {
    console.error("[RevenueCat] Failed to get offerings:", error);
    return null;
  }
};

// Export configuration helpers
export { isEnabled as isRevenueCatEnabled, isConfigured as isRevenueCatConfigured };

// Export types
export type { SubscriptionStatus, PaywallResult, PurchaseResult } from "./types";

// Export hooks
export { useSubscription } from "./use-subscription";
