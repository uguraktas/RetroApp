import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type InfoCardProps = {
	icon: ComponentProps<typeof Ionicons>["name"];
	label: string;
	value: string;
};

export function InfoCard({ icon, label, value }: InfoCardProps) {
	return (
		<View className="rounded-xl bg-muted p-4">
			<View className="flex-row items-center">
				<View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-background">
					<Ionicons name={icon} size={20} className="text-muted-foreground" />
				</View>
				<View className="flex-1">
					<Text className="mb-1 text-xs font-medium text-muted-foreground">
						{label}
					</Text>
					<Text className="text-sm font-medium text-foreground">{value}</Text>
				</View>
			</View>
		</View>
	);
}
