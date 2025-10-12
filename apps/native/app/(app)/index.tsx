import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.replace("/sign-in");
	};

	return (
		<Container>
			<View className="flex-1 justify-center py-8">
				<View className="rounded-lg border border-border bg-card p-6">
					{/* Header with Theme Toggle */}
					<View className="mb-6 flex-row items-center justify-between">
						<View>
							<Text className="mb-1 text-2xl font-semibold text-foreground">
								Dashboard
							</Text>
							<Text className="text-sm text-muted-foreground">
								Welcome back, {session?.user.name}!
							</Text>
						</View>
						<TouchableOpacity
							onPress={toggleColorScheme}
							className="items-center justify-center rounded-full bg-muted"
							style={{ width: 48, height: 48 }}
							activeOpacity={0.7}
						>
							<Ionicons
								name={isDarkColorScheme ? "sunny" : "moon"}
								size={24}
								className="text-foreground"
								color={isDarkColorScheme ? "#f59e0b" : "#6366f1"}
							/>
						</TouchableOpacity>
					</View>

					<View style={{ gap: 16 }}>
						<View className="rounded-md bg-muted p-4">
							<Text className="mb-1 text-xs text-muted-foreground">Email</Text>
							<Text className="text-foreground">{session?.user.email}</Text>
						</View>

						<View className="rounded-md bg-muted p-4">
							<Text className="mb-1 text-xs text-muted-foreground">Name</Text>
							<Text className="text-foreground">{session?.user.name}</Text>
						</View>

						<View className="rounded-md bg-muted p-4">
							<Text className="mb-1 text-xs text-muted-foreground">Theme</Text>
							<Text className="text-foreground">
								{isDarkColorScheme ? "Dark Mode" : "Light Mode"}
							</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleSignOut}
						className="mt-6 flex-row items-center justify-center rounded-md bg-destructive p-4"
						activeOpacity={0.8}
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
