import { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";

export default function HomeScreen() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending && !session) {
			router.replace("/login");
		}
	}, [session, isPending, router]);

	const handleSignOut = async () => {
		await authClient.signOut();
		router.replace("/login");
	};

	if (isPending) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<Container>
			<View className="flex-1 justify-center py-8">
				<View className="p-6 bg-card rounded-lg border border-border">
					<Text className="text-2xl font-semibold text-foreground mb-2">
						Dashboard
					</Text>
					<Text className="text-sm text-muted-foreground mb-6">
						Welcome back, {session.user.name}!
					</Text>

					<View className="space-y-4">
						<View className="p-4 bg-muted rounded-md">
							<Text className="text-xs text-muted-foreground mb-1">Email</Text>
							<Text className="text-foreground">{session.user.email}</Text>
						</View>

						<View className="p-4 bg-muted rounded-md">
							<Text className="text-xs text-muted-foreground mb-1">Name</Text>
							<Text className="text-foreground">{session.user.name}</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleSignOut}
						className="mt-6 bg-destructive p-4 rounded-md flex-row justify-center items-center"
					>
						<Text className="text-destructive-foreground font-medium">
							Sign Out
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	);
}
