import { Redirect, Stack } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { View, ActivityIndicator } from "react-native";

export default function AppLayout() {
	const { data: session, isPending } = authClient.useSession();

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
