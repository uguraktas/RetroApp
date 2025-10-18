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
import { useColorScheme } from "@/lib/use-color-scheme";
import { queryClient } from "@/utils/trpc";

type SignInProps = {
  onSwitchToSignUp: () => void;
};

export function SignIn({ onSwitchToSignUp }: SignInProps) {
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess: async (context) => {
          const userId = context.data.user?.id;
          const userName = context.data.user?.name;
          const userEmail = context.data.user?.email;

          if (userId) {
            // For existing users signing in, just set user ID with basic info
            // Don't automatically enable email notifications for returning users
            await analytics.setUserId(userId, {
              name: userName,
              email: userEmail,
            });
          }

          setEmail("");
          setPassword("");
          queryClient.refetchQueries();
          router.replace("/(app)");
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
            name="person-circle"
            size={32}
          />
        </View>
        <Text
          className="text-center font-bold text-black tracking-tight dark:text-white"
          style={{ fontSize: 28, lineHeight: 36 }}
        >
          {t("signIn.title")}
        </Text>
        <Text
          className="text-center text-zinc-600 dark:text-zinc-400"
          style={{ fontSize: 15 }}
        >
          {t("signIn.description")}
        </Text>

        {/* Status Badge */}
        <View className="flex-row items-center self-center rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
          <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
          <Text className="font-medium text-black text-xs dark:text-white">
            {t("signIn.signingIn")}
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
          {/* Email Field */}
          <View style={{ gap: 8 }}>
            <Text className="font-medium text-black text-sm dark:text-white">
              {t("signIn.emailLabel")}
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
                placeholder="you@example.com"
                placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
                value={email}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={{ gap: 8 }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-black text-sm dark:text-white">
                {t("signIn.passwordLabel")}
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("signIn.forgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>
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
                placeholder={t("signIn.passwordPlaceholder")}
                placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
                secureTextEntry
                value={password}
              />
            </View>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="mt-6 h-12 flex-row items-center justify-center rounded-lg bg-blue-500"
          disabled={isLoading || !email || !password}
          onPress={handleLogin}
          style={{
            opacity: isLoading || !email || !password ? 0.6 : 1,
          }}
        >
          {isLoading ? (
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <ActivityIndicator color="#fff" size="small" />
              <Text className="font-semibold text-base text-white">
                {t("signIn.signingIn")}
              </Text>
            </View>
          ) : (
            <>
              <Ionicons
                color="#fff"
                name="log-in"
                size={20}
                style={{ marginRight: 8 }}
              />
              <Text className="font-semibold text-base text-white">
                {t("signIn.signInButton")}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="relative my-6">
          <View className="absolute inset-0 flex items-center">
            <View className="w-full border-zinc-300 border-t dark:border-zinc-700" />
          </View>
          <View className="relative flex justify-center">
            <Text
              className="bg-zinc-100 px-3 text-xs text-zinc-500 uppercase dark:bg-zinc-900 dark:text-zinc-400"
              style={{ letterSpacing: 0.5 }}
            >
              {t("signIn.orContinueWith")}
            </Text>
          </View>
        </View>

        {/* Social Login Buttons */}
        <View style={{ gap: 12 }}>
          {/* Google Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-12 flex-row items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <Ionicons
              color={isDarkColorScheme ? "#ffffff" : "#000000"}
              name="logo-google"
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text className="font-medium text-base text-black dark:text-white">
              {t("signIn.continueWithGoogle")}
            </Text>
          </TouchableOpacity>

          {/* Apple Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-12 flex-row items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <Ionicons
              color={isDarkColorScheme ? "#ffffff" : "#000000"}
              name="logo-apple"
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text className="font-medium text-base text-black dark:text-white">
              {t("signIn.continueWithApple")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Switch to Sign Up */}
      <View className="items-center">
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("signIn.dontHaveAccount")}{" "}
          <Text
            className="font-semibold text-blue-500"
            onPress={onSwitchToSignUp}
          >
            {t("signIn.createAccount")}
          </Text>
        </Text>
      </View>
    </View>
  );
}
