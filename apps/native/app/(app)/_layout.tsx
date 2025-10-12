import { Redirect, Stack } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { useAnalyticsUserSync } from "@/lib/use-analytics-user-sync";
import { View, ActivityIndicator } from "react-native";

export default function AppLayout() {
	const { data: session, isPending } = authClient.useSession();

	// Sync user ID to analytics platforms (OneSignal, AppsFlyer, PostHog)
	// This ensures device tokens stay updated even if user doesn't login again
	useAnalyticsUserSync(session?.user?.id);

	// Show loading screen while checking authentication
	if (isPending) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	// Redirect to sign-in if not authenticated
	if (!session) {
		return <Redirect href="/sign-in" />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
		</Stack>
	);
}
