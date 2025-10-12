import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";

export default function HomeScreen() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.replace("/sign-in");
	};

	return (
		<Container>
			<View className="flex-1 justify-center py-8">
				<View className="rounded-lg border border-border bg-card p-6">
					<Text className="mb-2 text-2xl font-semibold text-foreground">
						Dashboard
					</Text>
					<Text className="mb-6 text-sm text-muted-foreground">
						Welcome back, {session?.user.name}!
					</Text>

					<View style={{ gap: 16 }}>
						<View className="rounded-md bg-muted p-4">
							<Text className="mb-1 text-xs text-muted-foreground">Email</Text>
							<Text className="text-foreground">{session?.user.email}</Text>
						</View>

						<View className="rounded-md bg-muted p-4">
							<Text className="mb-1 text-xs text-muted-foreground">Name</Text>
							<Text className="text-foreground">{session?.user.name}</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleSignOut}
						className="mt-6 flex-row items-center justify-center rounded-md bg-destructive p-4"
					>
						<Text className="font-medium text-destructive-foreground">
							Sign Out
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	);
}
