import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { InfoCard } from "@/components/info-card";
import { LanguageSelector } from "@/components/language-selector";
import { useI18n } from "@/hooks/use-i18n";

export default function HomeScreen() {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
	const { t, currentLanguage, getCurrentLanguageInfo } = useI18n();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.replace("/sign-in");
	};

	return (
		<View className="flex-1 bg-white dark:bg-black">
			<ScrollView className="flex-1 p-4 pt-16">
				{/* Header */}
				<View className="mb-8">
					<View className="mb-4 flex-row items-center justify-between">
						<View className="flex-1">
							<Text className="font-bold text-3xl text-black dark:text-white">
								{t('dashboard')}
							</Text>
							<Text className="mt-1 text-zinc-600 dark:text-zinc-400">
								{t('welcome_back_user', { name: session?.user.name })}
							</Text>
						</View>
						<View className="flex-row items-center" style={{ gap: 8 }}>
							<LanguageSelector />
							<TouchableOpacity
								onPress={toggleColorScheme}
								className="h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"
								activeOpacity={0.7}
							>
								<Ionicons
									name={isDarkColorScheme ? "sunny" : "moon"}
									size={22}
									color={isDarkColorScheme ? "#fbbf24" : "#4f46e5"}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* Status Badge */}
					<View className="flex-row items-center self-start rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
						<View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
						<Text className="font-medium text-black text-xs dark:text-white">
							{t('all_systems_operational')}
						</Text>
					</View>
				</View>

				{/* Info Cards */}
				<View className="gap-3">
					<InfoCard
						icon="mail"
						label={t('email_address_label')}
						value={session?.user.email || ""}
					/>
					<InfoCard
						icon="person"
						label={t('full_name_label')}
						value={session?.user.name || ""}
					/>
					<InfoCard
						icon={isDarkColorScheme ? "moon" : "sunny"}
						label={t('current_theme')}
						value={isDarkColorScheme ? t('dark_mode') : t('light_mode')}
					/>
					<InfoCard
						icon="language"
						label={t('language')}
						value={getCurrentLanguageInfo().name}
					/>
				</View>

				{/* Sign Out Button */}
				<TouchableOpacity
					onPress={handleSignOut}
					className="mt-8 h-12 flex-row items-center justify-center rounded-lg bg-red-500"
					activeOpacity={0.8}
				>
					<Ionicons name="log-out-outline" size={20} color="#fff" />
					<Text className="ml-2 font-semibold text-base text-white">
						{t('sign_out')}
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}
