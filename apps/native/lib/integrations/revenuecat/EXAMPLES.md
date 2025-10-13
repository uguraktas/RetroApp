# RevenueCat Integration Examples

Practical code examples for common subscription scenarios.

## Example 1: Simple Paywall Button

The simplest way to add subscriptions to your app:

```typescript
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/lib/integrations';

export function UpgradeButton() {
  const { isActive, isLoading, showPaywall } = useSubscription();

  const handlePress = async () => {
    const result = await showPaywall();

    if (result.purchased) {
      Alert.alert('Success', 'Welcome to Pro!');
    }
  };

  // Don't show button if already subscribed
  if (isActive) return null;

  return (
    <Button
      onPress={handlePress}
      disabled={isLoading}
    >
      Upgrade to Pro
    </Button>
  );
}
```

## Example 2: Premium Content Gate

Lock content behind subscription:

```typescript
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/lib/integrations';

export function PremiumContentScreen() {
  const { isActive, isLoading, showPaywall } = useSubscription();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isActive) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold mb-4">
          Premium Content
        </Text>
        <Text className="text-muted-foreground mb-8 text-center">
          Subscribe to unlock exclusive features
        </Text>
        <Button onPress={showPaywall}>
          Start Free Trial
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      {/* Your premium content here */}
      <PremiumContent />
    </View>
  );
}
```

## Example 3: Settings Screen with Subscription Info

Display subscription status in settings:

```typescript
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/lib/integrations';

export function SubscriptionSettings() {
  const { isActive, status, isLoading, showPaywall, restore } = useSubscription();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Subscription</Text>

      {isActive ? (
        <View className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <Text className="text-green-700 dark:text-green-300 font-semibold mb-2">
            ✅ Pro Member
          </Text>

          {status?.expirationDate && (
            <Text className="text-sm text-muted-foreground mb-1">
              Expires: {status.expirationDate.toLocaleDateString()}
            </Text>
          )}

          <Text className="text-sm text-muted-foreground mb-1">
            Auto-Renew: {status?.willRenew ? 'Enabled' : 'Disabled'}
          </Text>

          {status?.isInTrial && (
            <Text className="text-sm text-orange-600 dark:text-orange-400 mt-2">
              🎉 Free Trial Active
            </Text>
          )}
        </View>
      ) : (
        <View className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
          <Text className="text-muted-foreground font-semibold mb-2">
            Free Plan
          </Text>
          <Text className="text-sm text-muted-foreground mb-4">
            Upgrade to unlock all features
          </Text>

          <Button onPress={showPaywall} className="mb-2">
            Upgrade to Pro
          </Button>

          <Button
            onPress={restore}
            variant="outline"
          >
            Restore Purchases
          </Button>
        </View>
      )}
    </View>
  );
}
```

## Example 4: Feature Toggle Based on Subscription

Enable/disable features based on subscription:

```typescript
import { View } from 'react-native';
import { useSubscription } from '@/lib/integrations';

export function FeatureList() {
  const { isActive } = useSubscription();

  return (
    <View>
      {/* Always available */}
      <BasicFeature />

      {/* Premium only */}
      {isActive && (
        <>
          <AdvancedAnalytics />
          <CustomThemes />
          <PrioritySupport />
        </>
      )}
    </View>
  );
}
```

## Example 5: Onboarding with Trial

Show paywall during onboarding:

```typescript
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { showPaywall } from '@/lib/integrations';
import { router } from 'expo-router';

export function OnboardingPaywall() {
  const handleStartTrial = async () => {
    const result = await showPaywall();

    if (result.purchased) {
      // User subscribed, continue to app
      router.replace('/(app)');
    } else if (result.cancelled) {
      // User skipped, still allow access
      router.replace('/(app)');
    }
  };

  const handleSkip = () => {
    router.replace('/(app)');
  };

  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-3xl font-bold mb-4">
        Start Your Free Trial
      </Text>

      <Text className="text-center text-muted-foreground mb-8">
        Try Pro features free for 7 days. Cancel anytime.
      </Text>

      <Button
        onPress={handleStartTrial}
        className="w-full mb-4"
      >
        Start Free Trial
      </Button>

      <Button
        onPress={handleSkip}
        variant="ghost"
      >
        Continue with Free
      </Button>
    </View>
  );
}
```

## Example 6: Usage Limit with Paywall

Implement usage limits for free users:

```typescript
import { useState } from 'react';
import { Alert } from 'react-native';
import { useSubscription } from '@/lib/integrations';

export function useFeatureLimit() {
  const { isActive, showPaywall } = useSubscription();
  const [usageCount, setUsageCount] = useState(0);

  const FREE_LIMIT = 5; // Free users get 5 uses

  const checkLimit = async (): Promise<boolean> => {
    // Pro users have unlimited access
    if (isActive) {
      return true;
    }

    // Check if free user hit limit
    if (usageCount >= FREE_LIMIT) {
      Alert.alert(
        'Limit Reached',
        `You've used all ${FREE_LIMIT} free actions. Upgrade to Pro for unlimited access.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: async () => {
              await showPaywall();
            },
          },
        ]
      );
      return false;
    }

    // Increment usage
    setUsageCount(prev => prev + 1);
    return true;
  };

  return { checkLimit, usageCount, remaining: FREE_LIMIT - usageCount };
}

// Usage in component:
function MyFeature() {
  const { checkLimit, remaining } = useFeatureLimit();

  const handleAction = async () => {
    const canProceed = await checkLimit();

    if (canProceed) {
      // Perform action
      console.log(`Actions remaining: ${remaining}`);
    }
  };

  return <Button onPress={handleAction}>Use Feature</Button>;
}
```

## Example 7: Discount Paywall for Churned Users

Show special pricing to users who cancelled:

```typescript
import { useEffect } from 'react';
import { showPaywallWithOffering } from '@/lib/integrations';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useChurnedUserPaywall() {
  useEffect(() => {
    checkChurnStatus();
  }, []);

  const checkChurnStatus = async () => {
    // Check if user had subscription before
    const hadSubscription = await AsyncStorage.getItem('had_subscription');
    const subscriptionEnded = await AsyncStorage.getItem('subscription_ended');

    if (hadSubscription && subscriptionEnded) {
      // Show win-back offer
      setTimeout(() => {
        showWinBackOffer();
      }, 2000); // Show after 2 seconds
    }
  };

  const showWinBackOffer = async () => {
    // Show special 50% off offering
    const result = await showPaywallWithOffering('win_back_50_off');

    if (result.purchased) {
      await AsyncStorage.removeItem('subscription_ended');
    }
  };
}
```

## Example 8: Seasonal Promotion

Show seasonal paywalls automatically:

```typescript
import { showPaywall, showPaywallWithOffering } from '@/lib/integrations';

export const showSeasonalPaywall = async () => {
  const month = new Date().getMonth();

  // December: Holiday special
  if (month === 11) {
    return await showPaywallWithOffering('holiday_special');
  }

  // November: Black Friday
  if (month === 10) {
    return await showPaywallWithOffering('black_friday');
  }

  // July: Summer sale
  if (month === 6) {
    return await showPaywallWithOffering('summer_sale');
  }

  // Default paywall
  return await showPaywall();
};

// Usage:
function UpgradeButton() {
  const handleUpgrade = async () => {
    const result = await showSeasonalPaywall();

    if (result.purchased) {
      Alert.alert('Success', 'Welcome to Pro!');
    }
  };

  return <Button onPress={handleUpgrade}>Upgrade Now</Button>;
}
```

## Example 9: Restore Purchases Flow

Complete restore purchases screen:

```typescript
import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import { restorePurchases } from '@/lib/integrations';

export function RestorePurchasesScreen() {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);

    try {
      const restored = await restorePurchases();

      if (restored) {
        Alert.alert(
          'Success',
          'Your purchases have been restored!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any purchases to restore. If you purchased on a different device, make sure you\'re signed in with the same Apple ID or Google account.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-xl font-bold mb-4">
        Restore Purchases
      </Text>

      <Text className="text-center text-muted-foreground mb-8">
        If you purchased a subscription on this device or another device with
        the same Apple ID or Google account, you can restore it here.
      </Text>

      <Button
        onPress={handleRestore}
        disabled={isRestoring}
        className="w-full"
      >
        {isRestoring ? 'Restoring...' : 'Restore Purchases'}
      </Button>
    </View>
  );
}
```

## Example 10: Custom Paywall UI

Build your own paywall instead of using RevenueCat's:

```typescript
import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { getOfferings, purchasePackage } from '@/lib/integrations';
import type { PurchasesPackage } from 'react-native-purchases';

export function CustomPaywall() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    const offerings = await getOfferings();

    if (offerings?.current?.availablePackages) {
      setPackages(offerings.current.availablePackages);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setIsLoading(true);

    try {
      const result = await purchasePackage(pkg);

      if (result.success) {
        Alert.alert('Success', 'Welcome to Pro!');
      } else if (!result.userCancelled) {
        Alert.alert('Error', result.error || 'Purchase failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <Text className="text-3xl font-bold mb-4">Choose Your Plan</Text>

      {packages.map((pkg) => (
        <View
          key={pkg.identifier}
          className="bg-card p-6 rounded-lg mb-4 border border-border"
        >
          <Text className="text-xl font-bold mb-2">
            {pkg.product.title}
          </Text>

          <Text className="text-2xl font-bold text-primary mb-2">
            {pkg.product.priceString}
          </Text>

          <Text className="text-muted-foreground mb-4">
            {pkg.product.description}
          </Text>

          <Button
            onPress={() => handlePurchase(pkg)}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Subscribe'}
          </Button>
        </View>
      ))}
    </ScrollView>
  );
}
```

## Best Practices

### 1. Always Handle Errors

```typescript
const handleUpgrade = async () => {
  try {
    const result = await showPaywall();

    if (result.purchased) {
      // Success
    } else if (result.error) {
      Alert.alert('Error', result.error);
    }
  } catch (error) {
    console.error('Paywall error:', error);
    Alert.alert('Error', 'Something went wrong');
  }
};
```

### 2. Show Loading States

```typescript
const { isLoading, showPaywall } = useSubscription();

return (
  <Button
    onPress={showPaywall}
    disabled={isLoading}
  >
    {isLoading ? 'Loading...' : 'Upgrade to Pro'}
  </Button>
);
```

### 3. Refresh After Purchase

```typescript
const { showPaywall, refresh } = useSubscription();

const handleUpgrade = async () => {
  const result = await showPaywall();

  if (result.purchased) {
    await refresh(); // Refresh subscription status
  }
};
```

### 4. Provide Restore Option

Always give users a way to restore purchases:

```typescript
<Button onPress={restore} variant="outline">
  Restore Purchases
</Button>
```

### 5. Handle Trial Period

```typescript
const { status } = useSubscription();

{status?.isInTrial && (
  <Text>Free trial • {daysRemaining} days left</Text>
)}
```
