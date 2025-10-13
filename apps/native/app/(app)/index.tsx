import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { InfoCard } from "@/components/info-card";
import { LanguageSelector } from "@/components/language-selector";
import { NotificationSettings } from "@/components/notification-settings";
import { useI18n } from "@/contexts/i18n-context";
import { analytics } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";
import { isOneSignalEnabled, useSubscription } from "@/lib/integrations";
import { clearNotificationPreferences } from "@/lib/notification-preferences";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function HomeScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const { t, getCurrentLanguageInfo } = useI18n();
  const { isActive, status, isLoading, showPaywall, restore } = useSubscription();

  const handleSignOut = async () => {
    // Clear notification preferences and remove user from analytics
    await clearNotificationPreferences();
    await analytics.removeUserId();

    await authClient.signOut();
    router.replace("/sign-in");
  };

  const handleUpgrade = async () => {
    const result = await showPaywall();

    if (result.purchased) {
      Alert.alert(
        "Success",
        "Welcome to Pro! You now have access to all premium features.",
        [{ text: "OK" }]
      );
    }
  };

  const handleRestore = async () => {
    const restored = await restore();

    if (restored) {
      Alert.alert(
        "Success",
        "Your purchases have been restored!",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "No Purchases Found",
        "We couldn't find any purchases to restore.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 p-4 pt-16">
        {/* Header */}
        <View className="mb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-bold text-3xl text-black dark:text-white">
                {t("dashboard")}
              </Text>
              <Text className="mt-1 text-zinc-600 dark:text-zinc-400">
                {t("welcome_back_user", { name: session?.user.name })}
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <LanguageSelector />
              <TouchableOpacity
                activeOpacity={0.7}
                className="h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"
                onPress={toggleColorScheme}
              >
                <Ionicons
                  color={isDarkColorScheme ? "#fbbf24" : "#4f46e5"}
                  name={isDarkColorScheme ? "sunny" : "moon"}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Badge */}
          <View className="flex-row items-center self-start rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
            <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
            <Text className="font-medium text-black text-xs dark:text-white">
              {t("all_systems_operational")}
            </Text>
          </View>
        </View>

        {/* Subscription Status Card */}
        {!isLoading && (
          <View className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br dark:border-zinc-800">
            {isActive ? (
              // Pro Member Card
              <View className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <Ionicons color="#fff" name="diamond" size={20} />
                    </View>
                    <View>
                      <Text className="font-bold text-lg text-white">
                        Pro Member
                      </Text>
                      {status?.isInTrial && (
                        <Text className="text-white/80 text-xs">
                          Free Trial Active
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="rounded-full bg-white/20 px-3 py-1">
                    <Text className="font-semibold text-white text-xs">
                      ACTIVE
                    </Text>
                  </View>
                </View>

                {status?.expirationDate && (
                  <View className="mb-3 rounded-lg bg-white/10 p-3">
                    <Text className="mb-1 text-white/70 text-xs">
                      {status.willRenew ? "Renews on" : "Expires on"}
                    </Text>
                    <Text className="font-semibold text-white">
                      {status.expirationDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.8}
                  className="h-11 items-center justify-center rounded-lg bg-white/20"
                  onPress={handleRestore}
                >
                  <Text className="font-semibold text-white">
                    Restore Purchases
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Free Plan - Upgrade Prompt
              <View className="bg-white p-4 dark:bg-zinc-900">
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <Ionicons
                        color={isDarkColorScheme ? "#fff" : "#000"}
                        name="rocket-outline"
                        size={20}
                      />
                    </View>
                    <View>
                      <Text className="font-bold text-black text-lg dark:text-white">
                        Free Plan
                      </Text>
                      <Text className="text-zinc-600 text-xs dark:text-zinc-400">
                        Upgrade to unlock all features
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mb-3 gap-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      color={isDarkColorScheme ? "#4ade80" : "#16a34a"}
                      name="checkmark-circle"
                      size={18}
                    />
                    <Text className="ml-2 text-zinc-700 text-sm dark:text-zinc-300">
                      Unlimited access to all features
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      color={isDarkColorScheme ? "#4ade80" : "#16a34a"}
                      name="checkmark-circle"
                      size={18}
                    />
                    <Text className="ml-2 text-zinc-700 text-sm dark:text-zinc-300">
                      Priority support
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      color={isDarkColorScheme ? "#4ade80" : "#16a34a"}
                      name="checkmark-circle"
                      size={18}
                    />
                    <Text className="ml-2 text-zinc-700 text-sm dark:text-zinc-300">
                      No ads
                    </Text>
                  </View>
                </View>

                <View className="gap-2">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="h-12 items-center justify-center rounded-lg bg-indigo-600"
                    onPress={handleUpgrade}
                  >
                    <Text className="font-semibold text-base text-white">
                      Upgrade to Pro
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="h-10 items-center justify-center"
                    onPress={handleRestore}
                  >
                    <Text className="font-medium text-indigo-600 text-sm dark:text-indigo-400">
                      Restore Purchases
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Info Cards */}
        <View className="gap-3">
          <InfoCard
            icon="mail"
            label={t("email_address_label")}
            value={session?.user.email || ""}
          />
          <InfoCard
            icon="person"
            label={t("full_name_label")}
            value={session?.user.name || ""}
          />
          <InfoCard
            icon={isDarkColorScheme ? "moon" : "sunny"}
            label={t("current_theme")}
            value={isDarkColorScheme ? t("dark_mode") : t("light_mode")}
          />
          <InfoCard
            icon="language"
            label={t("language")}
            value={getCurrentLanguageInfo().name}
          />
        </View>

        {/* Notification Settings - Only show if OneSignal is enabled */}
        {isOneSignalEnabled && (
          <View className="mt-6">
            <NotificationSettings userEmail={session?.user.email} />
          </View>
        )}

        {/* Sign Out Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="mt-8 h-12 flex-row items-center justify-center rounded-lg bg-red-500"
          onPress={handleSignOut}
        >
          <Ionicons color="#fff" name="log-out-outline" size={20} />
          <Text className="ml-2 font-semibold text-base text-white">
            {t("sign_out")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
