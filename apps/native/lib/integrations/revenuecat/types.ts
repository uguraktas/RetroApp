/**
 * RevenueCat Integration Types
 * Clean type definitions for subscription management
 */

/**
 * Subscription status information
 */
export type SubscriptionStatus = {
  /** Whether user has an active subscription */
  isActive: boolean;
  /** Whether user is in a free trial period */
  isInTrial: boolean;
  /** Expiration date of current subscription (null if not subscribed) */
  expirationDate: Date | null;
  /** Whether subscription will auto-renew */
  willRenew: boolean;
  /** Entitlement identifier (e.g., "pro", "premium") */
  entitlementId: string | null;
};

/**
 * Paywall display result
 */
export type PaywallResult = {
  /** Whether user completed a purchase */
  purchased: boolean;
  /** Whether user cancelled/dismissed the paywall */
  cancelled: boolean;
  /** Any error that occurred */
  error?: string;
};

/**
 * Purchase result from RevenueCat
 */
export type PurchaseResult = {
  /** Whether purchase was successful */
  success: boolean;
  /** User cancelled the purchase flow */
  userCancelled: boolean;
  /** Error message if purchase failed */
  error?: string;
};
