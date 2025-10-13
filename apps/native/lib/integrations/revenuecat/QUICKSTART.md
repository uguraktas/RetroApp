# RevenueCat Integration - Quick Start Guide

Get up and running with subscriptions in 5 minutes.

## Step 1: Configure Environment Variables

Add your RevenueCat API keys to `.env`:

```bash
# Get these from: https://app.revenuecat.com/settings/api-keys
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_PRO_ENTITLEMENT_ID=pro
```

**Where to find your keys:**
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Navigate to Settings → API Keys
3. Copy your iOS and Android keys
4. The entitlement ID is what you configure in RevenueCat Entitlements section

## Step 2: That's It!

RevenueCat is already integrated and will:
- ✅ Initialize automatically on app startup
- ✅ Sync user IDs when users log in
- ✅ Clean up when users log out

## Usage Example

Add this to any screen where you want to show a subscription prompt:

```typescript
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/lib/integrations';

export function MyScreen() {
  const { isActive, showPaywall } = useSubscription();

  return (
    <View>
      {isActive ? (
        <PremiumContent />
      ) : (
        <Button onPress={showPaywall}>
          Upgrade to Pro
        </Button>
      )}
    </View>
  );
}
```

## RevenueCat Dashboard Setup

Before testing, configure your products in RevenueCat:

### 1. Create App in RevenueCat
- Go to [RevenueCat Dashboard](https://app.revenuecat.com)
- Create new project or app
- Add your App Store Connect and Google Play credentials

### 2. Create Entitlement
- Navigate to **Entitlements**
- Click **Create Entitlement**
- Identifier: `pro` (or match your .env)
- Display Name: `Pro`

### 3. Create Products
- Navigate to **Products**
- Click **Add Product**
- Add your product IDs from App Store Connect / Google Play Console
- Link products to the `pro` entitlement

### 4. Create Offering
- Navigate to **Offerings**
- Click **Create Offering**
- Identifier: `default`
- Add your products to the offering
- Make it the current offering

### 5. Configure Paywall (Optional)
- Navigate to **Paywalls** (RevenueCat UI)
- Click **Create Paywall**
- Design your paywall UI
- Link to your offering
- Publish

## Testing

### iOS Testing
```bash
# Use sandbox Apple ID
# Go to Settings → App Store → Sandbox Account
# Sign in with a sandbox test account from App Store Connect
```

### Android Testing
```bash
# Use test account in Google Play Console
# Add your Google account as a tester
# Install the app via internal testing track
```

## Common Issues

### "RevenueCat not initialized"
- Check that your API keys are set in `.env`
- Restart your app (CMD+R in simulator)

### "No entitlement found"
- Make sure entitlement ID in `.env` matches RevenueCat dashboard
- Check that products are linked to the entitlement

### "Paywall not showing"
- Ensure you have created an offering in RevenueCat
- Check that offering has products
- Verify offering is marked as "current"

## Next Steps

- [Read the full documentation](./README.md)
- [View code examples](./EXAMPLES.md)
- [RevenueCat Documentation](https://www.revenuecat.com/docs)

## Quick API Reference

```typescript
// Check if user has subscription
const isActive = await isSubscriptionActive();

// Show paywall
const result = await showPaywall();

// Get full subscription details
const status = await getSubscriptionStatus();

// Restore purchases
const restored = await restorePurchases();

// React hook (recommended)
const { isActive, showPaywall, restore } = useSubscription();
```

## Support

Need help? Check:
- [Full README](./README.md) - Complete documentation
- [Examples](./EXAMPLES.md) - Code examples for common scenarios
- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [RevenueCat Community](https://community.revenuecat.com/)
