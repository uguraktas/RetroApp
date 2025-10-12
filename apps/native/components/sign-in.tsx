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

type SignInProps = {
	onSwitchToSignUp: () => void;
};

export function SignIn({ onSwitchToSignUp }: SignInProps) {
	const router = useRouter();
	const { isDarkColorScheme } = useColorScheme();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async () => {
		setIsLoading(true);
		setError(null);

		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onError: (error) => {
					setError(error.error?.message || "Failed to sign in");
					setIsLoading(false);
				},
				onSuccess: () => {
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
						name="person-circle"
						size={32}
						color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
					/>
				</View>
				<Text
					className="text-center font-bold tracking-tight text-black dark:text-white"
					style={{ fontSize: 28, lineHeight: 36 }}
				>
					Welcome back
				</Text>
				<Text
					className="text-center text-zinc-600 dark:text-zinc-400"
					style={{ fontSize: 15 }}
				>
					Enter your credentials to access your account
				</Text>
				
				{/* Status Badge */}
				<View className="flex-row items-center self-center rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
					<View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
					<Text className="font-medium text-black text-xs dark:text-white">
						Secure sign in
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
					{/* Email Field */}
					<View style={{ gap: 8 }}>
						<Text className="font-medium text-sm text-black dark:text-white">
							Email address
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
						<View className="flex-row items-center justify-between">
							<Text className="font-medium text-sm text-black dark:text-white">
								Password
							</Text>
							<TouchableOpacity activeOpacity={0.7}>
								<Text className="text-sm text-zinc-500 dark:text-zinc-400">
									Forgot password?
								</Text>
							</TouchableOpacity>
						</View>
						<View className="flex-row items-center rounded-lg bg-zinc-200 px-4 dark:bg-zinc-800" style={{ height: 48 }}>
							<Ionicons
								name="lock-closed"
								size={20}
								color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
								style={{ marginRight: 12 }}
							/>
							<TextInput
								className="flex-1 text-base text-black dark:text-white"
								placeholder="Enter your password"
								value={password}
								onChangeText={setPassword}
								placeholderTextColor={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
								secureTextEntry
								editable={!isLoading}
							/>
						</View>
					</View>
				</View>

				{/* Sign In Button */}
				<TouchableOpacity
					onPress={handleLogin}
					disabled={isLoading || !email || !password}
					className="mt-6 h-12 flex-row items-center justify-center rounded-lg bg-blue-500"
					style={{
						opacity: isLoading || !email || !password ? 0.6 : 1,
					}}
					activeOpacity={0.8}
				>
					{isLoading ? (
						<View className="flex-row items-center" style={{ gap: 8 }}>
							<ActivityIndicator size="small" color="#fff" />
							<Text className="font-semibold text-base text-white">
								Signing in...
							</Text>
						</View>
					) : (
						<>
							<Ionicons name="log-in" size={20} color="#fff" style={{ marginRight: 8 }} />
							<Text className="font-semibold text-base text-white">Sign in</Text>
						</>
					)}
				</TouchableOpacity>

				{/* Divider */}
				<View className="relative my-6">
					<View className="absolute inset-0 flex items-center">
						<View className="w-full border-t border-zinc-300 dark:border-zinc-700" />
					</View>
					<View className="relative flex justify-center">
						<Text
							className="bg-zinc-100 px-3 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
							style={{ letterSpacing: 0.5 }}
						>
							OR CONTINUE WITH
						</Text>
					</View>
				</View>

				{/* Social Login Buttons */}
				<View style={{ gap: 12 }}>
					{/* Google Button */}
					<TouchableOpacity
						disabled={isLoading}
						className="h-12 flex-row items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800"
						style={{
							opacity: isLoading ? 0.5 : 1,
						}}
						activeOpacity={0.7}
					>
						<Ionicons 
							name="logo-google" 
							size={20} 
							color={isDarkColorScheme ? "#ffffff" : "#000000"} 
							style={{ marginRight: 8 }} 
						/>
						<Text className="font-medium text-base text-black dark:text-white">
							Continue with Google
						</Text>
					</TouchableOpacity>

					{/* Apple Button */}
					<TouchableOpacity
						disabled={isLoading}
						className="h-12 flex-row items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800"
						style={{
							opacity: isLoading ? 0.5 : 1,
						}}
						activeOpacity={0.7}
					>
						<Ionicons 
							name="logo-apple" 
							size={20} 
							color={isDarkColorScheme ? "#ffffff" : "#000000"} 
							style={{ marginRight: 8 }} 
						/>
						<Text className="font-medium text-base text-black dark:text-white">
							Continue with Apple
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Switch to Sign Up */}
			<View className="items-center">
				<Text className="text-sm text-zinc-600 dark:text-zinc-400">
					Don't have an account?{" "}
					<Text
						onPress={onSwitchToSignUp}
						className="font-semibold text-blue-500"
					>
						Create account
					</Text>
				</Text>
			</View>
		</View>
	);
}
