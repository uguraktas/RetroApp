import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { InfoCard } from "@/components/info-card";

export default function HomeScreen() {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.replace("/sign-in");
	};

	return (
		<View className="flex-1 bg-background">
			<ScrollView className="flex-1 p-4 pt-16">
				{/* Header */}
				<View className="mb-8">
					<View className="mb-4 flex-row items-center justify-between">
						<View className="flex-1">
							<Text className="font-bold text-3xl text-foreground">
								Dashboard
							</Text>
							<Text className="mt-1 text-muted-foreground">
								Welcome back, {session?.user.name}!
							</Text>
						</View>
						<TouchableOpacity
							onPress={toggleColorScheme}
							className="h-11 w-11 items-center justify-center rounded-full bg-muted"
							activeOpacity={0.7}
						>
							<Ionicons
								name={isDarkColorScheme ? "sunny" : "moon"}
								size={22}
								className="text-primary"
							/>
						</TouchableOpacity>
					</View>

					{/* Status Badge */}
					<View className="flex-row items-center self-start rounded-full bg-muted px-3 py-1.5">
						<View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
						<Text className="font-medium text-xs text-foreground">
							All systems operational
						</Text>
					</View>
				</View>

				{/* Info Cards */}
				<View className="gap-3">
					<InfoCard
						icon="mail"
						label="Email Address"
						value={session?.user.email || ""}
					/>
					<InfoCard
						icon="person"
						label="Full Name"
						value={session?.user.name || ""}
					/>
					<InfoCard
						icon={isDarkColorScheme ? "moon" : "sunny"}
						label="Current Theme"
						value={isDarkColorScheme ? "Dark Mode" : "Light Mode"}
					/>
				</View>

				{/* Sign Out Button */}
				<TouchableOpacity
					onPress={handleSignOut}
					className="mt-8 h-12 flex-row items-center justify-center rounded-lg bg-destructive"
					activeOpacity={0.8}
				>
					<Ionicons name="log-out-outline" size={20} color="#fff" />
					<Text className="ml-2 font-semibold text-base text-destructive-foreground">
						Sign Out
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}
