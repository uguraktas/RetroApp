import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";
import { useState } from "react";
import {
	ActivityIndicator,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useI18n } from "@/hooks/use-i18n";

type SignUpProps = {
	onSwitchToSignIn: () => void;
};



export function SignUp({ onSwitchToSignIn }: SignUpProps) {
	const router = useRouter();
	const { isDarkColorScheme } = useColorScheme();
	const { t } = useI18n();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSignUp = async () => {
		setIsLoading(true);
		setError(null);

		await authClient.signUp.email(
			{
				name,
				email,
				password,
			},
			{
				onError: (error) => {
					setError(error.error?.message || "Failed to sign up");
					setIsLoading(false);
				},
				onSuccess: () => {
					setName("");
					setEmail("");
					setPassword("");
					queryClient.refetchQueries();
					router.replace("/(app)");
				},
				onFinished: () => {
					setIsLoading(false);
				},
			},
		);
	};

	return (
		<View className="w-full" style={{ gap: 24 }}>
			{/* Header */}
			<View style={{ gap: 12 }} className="items-center">
				<View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
					<Ionicons
						name="person-add"
						size={32}
						color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
					/>
				</View>
				<Text
					className="text-center font-bold tracking-tight text-black dark:text-white"
					style={{ fontSize: 28, lineHeight: 36 }}
				>
					{t('create_account')}
				</Text>
				<Text
					className="text-center text-zinc-600 dark:text-zinc-400"
					style={{ fontSize: 15 }}
				>
					{t('sign_up_subtitle')}
				</Text>
				
				{/* Status Badge */}
				<View className="flex-row items-center self-center rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
					<View className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
					<Text className="font-medium text-black text-xs dark:text-white">
						{t('quick_setup')}
					</Text>
				</View>
			</View>

			{/* Form Card */}
			<View className="rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
				{error && (
					<View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
						<View className="flex-row items-center">
							<Ionicons 
								name="alert-circle" 
								size={16} 
								color={isDarkColorScheme ? "#f87171" : "#dc2626"} 
							/>
							<Text className="ml-2 text-sm text-red-600 dark:text-red-400">
								{error}
							</Text>
						</View>
					</View>
				)}

				<View style={{ gap: 20 }}>
					{/* Name Field */}
					<View style={{ gap: 8 }}>
						<Text className="font-medium text-sm text-black dark:text-white">
							{t('full_name')}
						</Text>
						<View className="flex-row items-center rounded-lg bg-zinc-200 px-4 dark:bg-zinc-800" style={{ height: 48 }}>
							<Ionicons
								name="person"
								size={20}
								color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
								style={{ marginRight: 12 }}
							/>
							<TextInput
								className="flex-1 text-base text-black dark:text-white"
								placeholder="John Doe"
								value={name}
								onChangeText={setName}
								placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
								editable={!isLoading}
							/>
						</View>
					</View>

					{/* Email Field */}
					<View style={{ gap: 8 }}>
						<Text className="font-medium text-sm text-black dark:text-white">
							{t('email_address')}
						</Text>
						<View className="flex-row items-center rounded-lg bg-zinc-200 px-4 dark:bg-zinc-800" style={{ height: 48 }}>
							<Ionicons
								name="mail"
								size={20}
								color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
								style={{ marginRight: 12 }}
							/>
							<TextInput
								className="flex-1 text-base text-black dark:text-white"
								placeholder="you@example.com"
								value={email}
								onChangeText={setEmail}
								placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
								keyboardType="email-address"
								autoCapitalize="none"
								editable={!isLoading}
							/>
						</View>
					</View>

					{/* Password Field */}
					<View style={{ gap: 8 }}>
						<Text className="font-medium text-sm text-black dark:text-white">
							{t('password')}
						</Text>
						<View className="flex-row items-center rounded-lg bg-zinc-200 px-4 dark:bg-zinc-800" style={{ height: 48 }}>
							<Ionicons
								name="lock-closed"
								size={20}
								color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
								style={{ marginRight: 12 }}
							/>
							<TextInput
								className="flex-1 text-base text-black dark:text-white"
								placeholder={t('password')}
								value={password}
								onChangeText={setPassword}
								placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
								secureTextEntry
								editable={!isLoading}
							/>
						</View>
						<Text className="text-xs text-zinc-500 dark:text-zinc-400">
							{t('must_be_8_characters')}
						</Text>
					</View>
				</View>

				{/* Sign Up Button */}
				<TouchableOpacity
					onPress={handleSignUp}
					disabled={isLoading || !name || !email || !password}
					className="mt-6 h-12 flex-row items-center justify-center rounded-lg bg-green-500"
					style={{
						opacity: isLoading || !name || !email || !password ? 0.6 : 1,
					}}
					activeOpacity={0.8}
				>
					{isLoading ? (
						<View className="flex-row items-center" style={{ gap: 8 }}>
							<ActivityIndicator size="small" color="#fff" />
							<Text className="font-semibold text-base text-white">
								{t('creating_account')}
							</Text>
						</View>
					) : (
						<>
							<Ionicons name="person-add" size={20} color="#fff" style={{ marginRight: 8 }} />
							<Text className="font-semibold text-base text-white">
								{t('create_account_btn')}
							</Text>
						</>
					)}
				</TouchableOpacity>



				{/* Terms */}
				<View className="mt-6">
					<Text
						className="text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400"
						style={{ lineHeight: 18 }}
					>
						{t('terms_text')}{" "}
						<Text className="font-medium text-blue-500 underline">{t('terms_of_service')}</Text> and{" "}
						<Text className="font-medium text-blue-500 underline">{t('privacy_policy')}</Text>
					</Text>
				</View>
			</View>

			{/* Switch to Sign In */}
			<View className="items-center">
				<Text className="text-sm text-zinc-600 dark:text-zinc-400">
					{t('already_have_account')}{" "}
					<Text
						onPress={onSwitchToSignIn}
						className="font-semibold text-blue-500"
					>
						{t('sign_in')}
					</Text>
				</Text>
			</View>
		</View>
	);
}
