import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Switch, Text, View } from "react-native";
import { OneSignal } from "react-native-onesignal";
import {
  addEmailSubscription,
  isOneSignalEnabled,
  isPushSubscribed,
  removeEmailSubscription,
  setPushNotificationEnabled,
} from "@/lib/integrations";
import {
  getEmailNotificationPreference,
  setEmailNotificationPreference,
} from "@/lib/notification-preferences";
import { useColorScheme } from "@/lib/use-color-scheme";

type NotificationSettingsProps = {
  userEmail?: string;
};

const SUBSCRIPTION_CHECK_DELAY = 1000;

export function NotificationSettings({ userEmail }: NotificationSettingsProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // Load initial permission states and listen for changes
  useEffect(() => {
    const loadPermissions = async () => {
      setIsLoading(true);

      // Check BOTH permission AND opt-in status
      const isSubscribed = await isPushSubscribed();
      setPushEnabled(isSubscribed);

      // Check email notification preference from local storage
      const hasEmailEnabled = await getEmailNotificationPreference();
      setEmailEnabled(hasEmailEnabled);

      setIsLoading(false);
    };

    const handlePushSubscriptionChange = () => {
      isPushSubscribed()
        .then((isSubscribed) => {
          console.log(
            "🚀 ~ handlePushSubscriptionChange ~ isSubscribed:",
            isSubscribed
          );
          setPushEnabled(isSubscribed);
        })
        .catch(() => {
          // Silent fail
        });
    };

    if (isOneSignalEnabled) {
      OneSignal.User.pushSubscription.addEventListener(
        "change",
        handlePushSubscriptionChange
      );
    }

    loadPermissions().catch(() => {
      // Silent fail
    });

    return () => {
      if (isOneSignalEnabled) {
        OneSignal.User.pushSubscription.removeEventListener(
          "change",
          handlePushSubscriptionChange
        );
      }
    };
  }, []);

  const handlePushToggle = (value: boolean) => {
    // optIn() will automatically request permission if needed
    // optOut() will unsubscribe
    setPushNotificationEnabled(value);

    // Give OneSignal time to process and update subscription
    // The event listener will update the UI once the change is complete
    setTimeout(() => {
      isPushSubscribed()
        .then((isSubscribed) => {
          console.log;
          setPushEnabled(isSubscribed);
        })
        .catch(() => {
          console.log("🚀 ~ handlePushToggle ~ error:", error);
          // Silent fail
        });
    }, SUBSCRIPTION_CHECK_DELAY);
  };

  const handleEmailToggle = async (value: boolean) => {
    if (!userEmail) {
      return;
    }

    setEmailEnabled(value);

    // Save preference to local storage
    await setEmailNotificationPreference(value);

    // Update OneSignal email subscription
    if (value) {
      addEmailSubscription(userEmail);
    } else {
      removeEmailSubscription(userEmail);
    }
  };

  if (!isOneSignalEnabled) {
    return null;
  }

  if (isLoading) {
    return (
      <View className="rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
        <View
          className="flex-row items-center justify-center"
          style={{ gap: 12 }}
        >
          <ActivityIndicator size="small" />
          <Text className="text-sm text-zinc-600 dark:text-zinc-400">
            Loading notification settings...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
      {/* Header */}
      <View className="mb-4 flex-row items-center" style={{ gap: 12 }}>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Ionicons
            color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
            name="notifications"
            size={20}
          />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-base text-black dark:text-white">
            Notification Settings
          </Text>
          <Text className="text-xs text-zinc-600 dark:text-zinc-400">
            Manage your notification preferences
          </Text>
        </View>
      </View>

      {/* Push Notifications Toggle */}
      <View
        className="mb-3 flex-row items-center justify-between rounded-lg bg-zinc-200 p-4 dark:bg-zinc-800"
        style={{ gap: 12 }}
      >
        <View className="flex-1" style={{ gap: 4 }}>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Ionicons
              color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
              name="phone-portrait"
              size={18}
            />
            <Text className="font-medium text-black text-sm dark:text-white">
              Push Notifications
            </Text>
          </View>
          <Text className="text-xs text-zinc-600 dark:text-zinc-400">
            {pushEnabled
              ? "Receive notifications on this device"
              : "Enable to receive push notifications"}
          </Text>
        </View>
        <Switch
          ios_backgroundColor="#3e3e3e"
          onValueChange={handlePushToggle}
          thumbColor={pushEnabled ? "#3b82f6" : "#f4f4f5"}
          trackColor={{ false: "#d4d4d8", true: "#93c5fd" }}
          value={pushEnabled}
        />
      </View>

      {/* Email Notifications Toggle */}
      <View
        className="flex-row items-center justify-between rounded-lg bg-zinc-200 p-4 dark:bg-zinc-800"
        style={{ gap: 12 }}
      >
        <View className="flex-1" style={{ gap: 4 }}>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Ionicons
              color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
              name="mail"
              size={18}
            />
            <Text className="font-medium text-black text-sm dark:text-white">
              Email Notifications
            </Text>
          </View>
          <Text className="text-xs text-zinc-600 dark:text-zinc-400">
            {emailEnabled && userEmail
              ? `Sending updates to ${userEmail}`
              : userEmail
                ? "Enable to receive email updates"
                : "Email address required"}
          </Text>
        </View>
        <Switch
          disabled={!userEmail}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleEmailToggle}
          thumbColor={emailEnabled ? "#3b82f6" : "#f4f4f5"}
          trackColor={{ false: "#d4d4d8", true: "#93c5fd" }}
          value={emailEnabled}
        />
      </View>

      {/* Info Banner */}
      <View
        className="mt-4 flex-row items-start rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30"
        style={{ gap: 10 }}
      >
        <Ionicons
          color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
          name="information-circle"
          size={18}
          style={{ marginTop: 1 }}
        />
        <Text
          className="flex-1 text-xs text-zinc-700 leading-relaxed dark:text-zinc-300"
          style={{ lineHeight: 18 }}
        >
          You can change these settings anytime. We respect your privacy and
          only send important updates.
        </Text>
      </View>
    </View>
  );
}
