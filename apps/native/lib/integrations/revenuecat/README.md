# RevenueCat Integration

Clean, modular subscription management using RevenueCat SDK for React Native/Expo apps.

## Features

- ✅ Initialize RevenueCat with platform-specific API keys
- ✅ Automatic user ID sync with auth system
- ✅ Check subscription status (active/trial/expired)
- ✅ Display paywall (supports dynamic paywalls from dashboard)
- ✅ Restore purchases
- ✅ React hooks for easy component integration
- ✅ TypeScript support with full type safety

## Setup

### 1. Configure Environment Variables

Add these to your `.env` file:

```bash
# iOS API Key from RevenueCat dashboard
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxxxxxxxxxx

# Android API Key from RevenueCat dashboard
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_xxxxxxxxxxxxx

# Entitlement ID (configured in RevenueCat dashboard)
EXPO_PUBLIC_REVENUECAT_PRO_ENTITLEMENT_ID=pro
```

### 2. Enable in Config

RevenueCat is enabled by default in `packages/config/index.ts`:

```typescript
integrations: {
  revenueCat: true, // ✅ Already enabled
}
```

### 3. Setup Complete!

The integration automatically:
- Initializes on app startup
- Syncs user IDs when users log in
- Cleans up when users log out

## Usage

### Basic: Check Subscription Status

```typescript
import { isSubscriptionActive } from '@/lib/integrations';

// Simple boolean check
const isSubscribed = await isSubscriptionActive();

if (isSubscribed) {
  // Show premium features
} else {
  // Show upgrade prompt
}
```

### Advanced: Get Full Subscription Details

```typescript
import { getSubscriptionStatus } from '@/lib/integrations';

const status = await getSubscriptionStatus();

console.log(status.isActive);         // true/false
console.log(status.isInTrial);        // true if in trial period
console.log(status.expirationDate);   // Date | null
console.log(status.willRenew);        // true if auto-renewing
console.log(status.entitlementId);    // "pro"
```

### Display Paywall

```typescript
import { showPaywall } from '@/lib/integrations';

// Show default paywall
const result = await showPaywall();

if (result.purchased) {
  // User completed purchase ✅
  console.log('Welcome to Pro!');
} else if (result.cancelled) {
  // User dismissed paywall
  console.log('Maybe next time');
}
```

### Display Discount Paywall

You can configure multiple offerings in RevenueCat dashboard (e.g., "summer_sale", "black_friday"):

```typescript
import { showPaywallWithOffering } from '@/lib/integrations';

// Show specific offering
const result = await showPaywallWithOffering('summer_sale');
```

### Restore Purchases

```typescript
import { restorePurchases } from '@/lib/integrations';

const restored = await restorePurchases();

if (restored) {
  console.log('Purchases restored successfully!');
}
```

## React Hook: useSubscription

For React components, use the `useSubscription` hook:

```typescript
import { useSubscription } from '@/lib/integrations';

function PremiumFeature() {
  const {
    isActive,      // Boolean: has subscription
    status,        // Full status details
    isLoading,     // Loading state
    showPaywall,   // Function to show paywall
    restore,       // Function to restore purchases
    refresh,       // Function to refresh status
  } = useSubscription();

  if (isLoading) {
    return <Loading />;
  }

  if (!isActive) {
    return (
      <Button onPress={showPaywall}>
        Upgrade to Pro
      </Button>
    );
  }

  return <PremiumContent />;
}
```

### Hook Examples

#### Simple Paywall Screen

```typescript
function PaywallScreen() {
  const { showPaywall, isLoading } = useSubscription();

  const handleUpgrade = async () => {
    const result = await showPaywall();

    if (result.purchased) {
      // Navigate to premium features
      router.push('/premium');
    }
  };

  return (
    <Button
      onPress={handleUpgrade}
      disabled={isLoading}
    >
      Start Free Trial
    </Button>
  );
}
```

#### Conditional Premium Content

```typescript
function ContentScreen() {
  const { isActive, isLoading, showPaywall } = useSubscription();

  if (isLoading) return <Skeleton />;

  return (
    <View>
      {/* Free content */}
      <FreeContent />

      {/* Premium content */}
      {isActive ? (
        <PremiumContent />
      ) : (
        <LockedContent onUnlock={showPaywall} />
      )}
    </View>
  );
}
```

#### Settings Screen with Subscription Info

```typescript
function SettingsScreen() {
  const { status, isActive, restore } = useSubscription();

  return (
    <View>
      <Text>Subscription Status</Text>

      {isActive ? (
        <View>
          <Text>✅ Pro Member</Text>
          <Text>Expires: {status?.expirationDate?.toLocaleDateString()}</Text>
          <Text>Auto-Renew: {status?.willRenew ? 'On' : 'Off'}</Text>
        </View>
      ) : (
        <View>
          <Text>❌ Free Plan</Text>
          <Button onPress={restore}>
            Restore Purchases
          </Button>
        </View>
      )}
    </View>
  );
}
```

## RevenueCat Dashboard Setup

### 1. Create Entitlement

1. Go to RevenueCat dashboard
2. Navigate to Entitlements
3. Create entitlement with ID: `pro` (or match your env var)

### 2. Create Products

1. Go to Products
2. Add your App Store/Play Store product IDs
3. Link products to the "pro" entitlement

### 3. Create Offerings

1. Go to Offerings
2. Create default offering with your products
3. (Optional) Create additional offerings for discounts:
   - `summer_sale`
   - `black_friday`
   - `student_discount`

### 4. Configure Paywall

1. Go to Paywalls (RevenueCat UI)
2. Design your paywall
3. Link to your offerings
4. The paywall will automatically display in your app

## Dynamic Paywalls (Discount Flows)

You can show different paywalls based on user behavior:

```typescript
// Show discount paywall to churned users
if (isChurnedUser) {
  await showPaywallWithOffering('win_back_discount');
}

// Show seasonal promotion
if (isHolidaySeason) {
  await showPaywallWithOffering('holiday_special');
}

// Default paywall
else {
  await showPaywall();
}
```

Configure these offerings in RevenueCat dashboard - no code changes needed!

## User Authentication Integration

User IDs are automatically synced when users log in via the analytics module:

```typescript
// This happens automatically in your auth flow
await analytics.setUserId(userId);

// Or with user details
await analytics.setUserWithNotifications({
  userId: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
});

// RevenueCat user is automatically set ✅
```

On logout:

```typescript
// This happens automatically
await analytics.removeUserId();

// RevenueCat user is automatically removed ✅
```

## API Reference

### Functions

- `initializeRevenueCat()` - Initialize SDK (auto-called on app startup)
- `setRevenueCatUser(userId)` - Set user ID (auto-called on login)
- `removeRevenueCatUser()` - Remove user (auto-called on logout)
- `isSubscriptionActive()` - Check if user has active subscription
- `getSubscriptionStatus()` - Get detailed subscription info
- `showPaywall()` - Display default paywall
- `showPaywallWithOffering(id)` - Display specific offering
- `restorePurchases()` - Restore previous purchases
- `getOfferings()` - Get available offerings (for custom UI)

### Types

```typescript
type SubscriptionStatus = {
  isActive: boolean;
  isInTrial: boolean;
  expirationDate: Date | null;
  willRenew: boolean;
  entitlementId: string | null;
};

type PaywallResult = {
  purchased: boolean;
  cancelled: boolean;
  error?: string;
};
```

## Troubleshooting

### "RevenueCat not initialized"

Make sure you have set the API keys in `.env`:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_xxxxx
EXPO_PUBLIC_REVENUECAT_PRO_ENTITLEMENT_ID=pro
```

### "No active entitlement"

Check your RevenueCat dashboard:
1. Product is created and linked to App Store/Play Store
2. Entitlement exists with correct ID
3. Product is added to an offering
4. User has valid subscription

### Testing Subscriptions

Use RevenueCat sandbox mode for testing:
1. Use sandbox Apple/Google accounts
2. Purchases won't be charged
3. Subscriptions expire faster for testing

## Resources

- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [Expo Integration Guide](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [React Native SDK Reference](https://sdk-reference.revenuecat.com/react-native/latest/)
- [RevenueCat Dashboard](https://app.revenuecat.com/)

## Support

For issues or questions:
1. Check RevenueCat dashboard for subscription status
2. Review logs in Xcode/Android Studio
3. Enable debug mode in development (automatically enabled)
4. Check [RevenueCat Community](https://community.revenuecat.com/)
