import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";

type InfoCardProps = {
	icon: ComponentProps<typeof Ionicons>["name"];
	label: string;
	value: string;
};

export function InfoCard({ icon, label, value }: InfoCardProps) {
	const { isDarkColorScheme } = useColorScheme();

	return (
		<View className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
			<View className="flex-row items-center">
				<View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
					<Ionicons
						color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
						name={icon}
						size={20}
					/>
				</View>
				<View className="flex-1">
					<Text className="mb-1 font-medium text-xs text-zinc-500 dark:text-zinc-400">
						{label}
					</Text>
					<Text className="font-medium text-sm text-black dark:text-white">
						{value}
					</Text>
				</View>
			</View>
		</View>
	);
}
