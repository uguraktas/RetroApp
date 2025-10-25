import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useI18n } from "@/contexts/i18n-context";
import { analytics } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";
import { setEmailNotificationPreference } from "@/lib/notification-preferences";
import { useColorScheme } from "@/lib/use-color-scheme";
import { queryClient } from "@/utils/trpc";

type SignUpProps = {
  onSwitchToSignIn: () => void;
};

export function SignUp({ onSwitchToSignIn }: SignUpProps) {
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign up");
          setIsLoading(false);
        },
        onSuccess: async (context) => {
          const userId = context.data.user?.id;
          const userName = context.data.user?.name;
          const userEmail = context.data.user?.email;

          if (userId && userName && userEmail) {
            // For new sign-ups, enable both push and email notifications by default
            // User already granted push permission during app startup
            await analytics.setUserWithNotifications({
              userId,
              name: userName,
              email: userEmail,
              enableEmailNotifications: true,
            });

            // Save email notification preference locally
            await setEmailNotificationPreference(true);
          }

          setName("");
          setEmail("");
          setPassword("");
          queryClient.refetchQueries();
          // Navigation is handled by the sign-in screen's useEffect watching session state
        },
        onFinished: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <View className="w-full" style={{ gap: 24 }}>
      {/* Header */}
      <View className="items-center" style={{ gap: 12 }}>
        <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
          <Ionicons
            color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
            name="person-add"
            size={32}
          />
        </View>
        <Text
          className="text-center font-bold text-black tracking-tight dark:text-white"
          style={{ fontSize: 28, lineHeight: 36 }}
        >
          {t("signUp.title")}
        </Text>
        <Text
          className="text-center text-zinc-600 dark:text-zinc-400"
          style={{ fontSize: 15 }}
        >
          {t("signUp.description")}
        </Text>

        {/* Status Badge */}
        <View className="flex-row items-center self-center rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
          <View className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
          <Text className="font-medium text-black text-xs dark:text-white">
            {t("signUp.creatingAccount")}
          </Text>
        </View>
      </View>

      {/* Form Card */}
      <View className="rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
        {error && (
          <View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
            <View className="flex-row items-center">
              <Ionicons
                color={isDarkColorScheme ? "#f87171" : "#dc2626"}
                name="alert-circle"
                size={16}
              />
              <Text className="ml-2 text-red-600 text-sm dark:text-red-400">
                {error}
              </Text>
            </View>
          </View>
        )}

        <View style={{ gap: 20 }}>
          {/* Name Field */}
          <View style={{ gap: 8 }}>
            <Text className="font-medium text-black text-sm dark:text-white">
              {t("signUp.fullNameLabel")}
            </Text>
            <View
              className="flex-row items-center rounded-lg bg-zinc-200 px-4 dark:bg-zinc-800"
              style={{ height: 48 }}
            >
              <Ionicons
                color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
                name="person"
                size={20}
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-base text-black dark:text-white"
                editable={!isLoading}
                onChangeText={setName}
                placeholder={t("signUp.fullNamePlaceholder")}
                placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
                value={name}
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={{ gap: 8 }}>
            <Text className="font-medium text-black text-sm dark:text-white">
              {t("signUp.emailLabel")}
            </Text>
            <View
              className="flex-row items-center rounded-lg bg-zinc-200 px-4 dark:bg-zinc-800"
              style={{ height: 48 }}
            >
              <Ionicons
                color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
                name="mail"
                size={20}
                style={{ marginRight: 12 }}
              />
              <TextInput
                autoCapitalize="none"
                className="flex-1 text-base text-black dark:text-white"
                editable={!isLoading}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder={t("signUp.emailPlaceholder")}
                placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
                value={email}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={{ gap: 8 }}>
            <Text className="font-medium text-black text-sm dark:text-white">
              {t("signUp.passwordLabel")}
            </Text>
            <View
              className="flex-row items-center rounded-lg bg-zinc-200 px-4 dark:bg-zinc-800"
              style={{ height: 48 }}
            >
              <Ionicons
                color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
                name="lock-closed"
                size={20}
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-base text-black dark:text-white"
                editable={!isLoading}
                onChangeText={setPassword}
                placeholder={t("signUp.passwordPlaceholder")}
                placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
                secureTextEntry
                value={password}
              />
            </View>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("signUp.passwordHint")}
            </Text>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="mt-6 h-12 flex-row items-center justify-center rounded-lg bg-green-500"
          disabled={isLoading || !name || !email || !password}
          onPress={handleSignUp}
          style={{
            opacity: isLoading || !name || !email || !password ? 0.6 : 1,
          }}
        >
          {isLoading ? (
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <ActivityIndicator color="#fff" size="small" />
              <Text className="font-semibold text-base text-white">
                {t("signUp.creatingAccount")}
              </Text>
            </View>
          ) : (
            <>
              <Ionicons
                color="#fff"
                name="person-add"
                size={20}
                style={{ marginRight: 8 }}
              />
              <Text className="font-semibold text-base text-white">
                {t("signUp.createAccountButton")}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <View className="mt-6">
          <Text
            className="text-center text-xs text-zinc-500 leading-relaxed dark:text-zinc-400"
            style={{ lineHeight: 18 }}
          >
            {t("signUp.termsAgreement")}{" "}
            <Text className="font-medium text-blue-500 underline">
              {t("signUp.termsOfService")}
            </Text>{" "}
            and{" "}
            <Text className="font-medium text-blue-500 underline">
              {t("signUp.privacyPolicy")}
            </Text>
          </Text>
        </View>
      </View>

      {/* Switch to Sign In */}
      <View className="items-center">
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("signUp.hasAccount")}{" "}
          <Text
            className="font-semibold text-blue-500"
            onPress={onSwitchToSignIn}
          >
            {t("signUp.signIn")}
          </Text>
        </Text>
      </View>
    </View>
  );
}
