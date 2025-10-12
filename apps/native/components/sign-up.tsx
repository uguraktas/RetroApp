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
import { Svg, Path } from "react-native-svg";

type SignUpProps = {
	onSwitchToSignIn: () => void;
};

const GoogleIcon = () => (
	<Svg width={16} height={16} viewBox="0 0 24 24" style={{ marginRight: 8 }}>
		<Path
			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			fill="#4285F4"
		/>
		<Path
			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			fill="#34A853"
		/>
		<Path
			d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			fill="#FBBC05"
		/>
		<Path
			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			fill="#EA4335"
		/>
	</Svg>
);

export function SignUp({ onSwitchToSignIn }: SignUpProps) {
	const router = useRouter();
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
					router.replace("/");
				},
				onFinished: () => {
					setIsLoading(false);
				},
			},
		);
	};

	return (
		<View className="w-full space-y-6">
			{/* Header */}
			<View className="space-y-2 items-center">
				<Text className="text-3xl font-bold text-foreground tracking-tight text-center">
					Create your account
				</Text>
				<Text className="text-muted-foreground text-center">
					Get started with your free account today
				</Text>
			</View>

			{/* Form Card */}
			<View className="rounded-2xl border border-border bg-card p-8 shadow-lg">
				{error && (
					<View className="mb-4 p-3 bg-destructive/10 rounded-md border border-destructive/20">
						<Text className="text-destructive text-sm">{error}</Text>
					</View>
				)}

				<View className="space-y-4">
					{/* Name Field */}
					<View className="space-y-2">
						<Text className="text-sm font-medium text-foreground">
							Full name
						</Text>
						<TextInput
							className="h-12 px-4 rounded-md bg-background text-foreground border border-border text-base"
							placeholder="John Doe"
							value={name}
							onChangeText={setName}
							placeholderTextColor="#9CA3AF"
							editable={!isLoading}
						/>
					</View>

					{/* Email Field */}
					<View className="space-y-2">
						<Text className="text-sm font-medium text-foreground">
							Email address
						</Text>
						<TextInput
							className="h-12 px-4 rounded-md bg-background text-foreground border border-border text-base"
							placeholder="you@example.com"
							value={email}
							onChangeText={setEmail}
							placeholderTextColor="#9CA3AF"
							keyboardType="email-address"
							autoCapitalize="none"
							editable={!isLoading}
						/>
					</View>

					{/* Password Field */}
					<View className="space-y-2">
						<Text className="text-sm font-medium text-foreground">
							Password
						</Text>
						<TextInput
							className="h-12 px-4 rounded-md bg-background text-foreground border border-border text-base"
							placeholder="Enter your password"
							value={password}
							onChangeText={setPassword}
							placeholderTextColor="#9CA3AF"
							secureTextEntry
							editable={!isLoading}
						/>
						<Text className="text-xs text-muted-foreground">
							Must be at least 8 characters
						</Text>
					</View>
				</View>

				{/* Sign Up Button */}
				<TouchableOpacity
					onPress={handleSignUp}
					disabled={isLoading || !name || !email || !password}
					className="mt-6 h-12 rounded-md flex-row justify-center items-center"
					style={{
						backgroundColor: "#ea580c",
						opacity: isLoading || !name || !email || !password ? 0.5 : 1,
					}}
				>
					{isLoading ? (
						<View className="flex-row items-center gap-2">
							<ActivityIndicator size="small" color="#fff" />
							<Text className="text-white font-medium text-base">
								Creating account...
							</Text>
						</View>
					) : (
						<Text className="text-white font-medium text-base">
							Create account
						</Text>
					)}
				</TouchableOpacity>

				{/* Divider */}
				<View className="relative my-6">
					<View className="absolute inset-0 flex items-center">
						<View className="w-full border-t border-border" />
					</View>
					<View className="relative flex justify-center">
						<Text className="bg-card px-2 text-xs uppercase text-muted-foreground">
							OR CONTINUE WITH
						</Text>
					</View>
				</View>

				{/* Google Button */}
				<TouchableOpacity
					disabled={isLoading}
					className="h-12 rounded-md border border-border flex-row justify-center items-center"
					style={{ opacity: isLoading ? 0.5 : 1 }}
				>
					<GoogleIcon />
					<Text className="text-foreground font-medium text-base">
						Continue with Google
					</Text>
				</TouchableOpacity>

				{/* Terms */}
				<View className="mt-4">
					<Text className="text-xs text-muted-foreground text-center leading-relaxed">
						By creating an account, you agree to our{" "}
						<Text className="underline">Terms of Service</Text> and{" "}
						<Text className="underline">Privacy Policy</Text>
					</Text>
				</View>
			</View>

			{/* Switch to Sign In */}
			<View className="items-center">
				<Text className="text-sm text-muted-foreground">
					Already have an account?{" "}
					<Text
						onPress={onSwitchToSignIn}
						className="font-semibold text-primary"
					>
						Sign in
					</Text>
				</Text>
			</View>
		</View>
	);
}
