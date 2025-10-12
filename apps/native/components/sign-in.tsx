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

type SignInProps = {
	onSwitchToSignUp: () => void;
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

export function SignIn({ onSwitchToSignUp }: SignInProps) {
	const router = useRouter();
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
					router.replace("/");
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
			<View style={{ gap: 8 }} className="items-center">
				<Text
					className="text-center font-bold tracking-tight text-foreground"
					style={{ fontSize: 32, lineHeight: 40 }}
				>
					Welcome back
				</Text>
				<Text
					className="text-center text-muted-foreground"
					style={{ fontSize: 15 }}
				>
					Enter your credentials to access your account
				</Text>
			</View>

			{/* Form Card */}
			<View
				className="rounded-3xl border border-border/50 bg-card"
				style={{
					padding: 24,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.1,
					shadowRadius: 24,
					elevation: 8,
				}}
			>
				{error && (
					<View
						className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10"
						style={{ padding: 12 }}
					>
						<Text className="text-sm text-destructive">{error}</Text>
					</View>
				)}

				<View style={{ gap: 20 }}>
					{/* Email Field */}
					<View style={{ gap: 8 }}>
						<Text className="text-sm font-medium text-foreground">
							Email address
						</Text>
						<TextInput
							className="rounded-lg border border-input bg-background px-4 text-base text-foreground"
							style={{ height: 48 }}
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
					<View style={{ gap: 8 }}>
						<View className="flex-row items-center justify-between">
							<Text className="text-sm font-medium text-foreground">
								Password
							</Text>
							<TouchableOpacity activeOpacity={0.7}>
								<Text className="text-sm text-muted-foreground">
									Forgot password?
								</Text>
							</TouchableOpacity>
						</View>
						<TextInput
							className="rounded-lg border border-input bg-background px-4 text-base text-foreground"
							style={{ height: 48 }}
							placeholder="Enter your password"
							value={password}
							onChangeText={setPassword}
							placeholderTextColor="#9CA3AF"
							secureTextEntry
							editable={!isLoading}
						/>
					</View>
				</View>

				{/* Sign In Button */}
				<TouchableOpacity
					onPress={handleLogin}
					disabled={isLoading || !email || !password}
					className="mt-6 flex-row items-center justify-center rounded-lg"
					style={{
						height: 48,
						backgroundColor: "#ea580c",
						opacity: isLoading || !email || !password ? 0.6 : 1,
						shadowColor: "#ea580c",
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 8,
						elevation: 4,
					}}
					activeOpacity={0.8}
				>
					{isLoading ? (
						<View className="flex-row items-center" style={{ gap: 8 }}>
							<ActivityIndicator size="small" color="#fff" />
							<Text className="text-base font-semibold text-white">
								Signing in...
							</Text>
						</View>
					) : (
						<Text className="text-base font-semibold text-white">Sign in</Text>
					)}
				</TouchableOpacity>

				{/* Divider */}
				<View className="relative my-6">
					<View className="absolute inset-0 flex items-center">
						<View className="w-full border-t border-border/60" />
					</View>
					<View className="relative flex justify-center">
						<Text
							className="bg-card px-3 text-xs uppercase text-muted-foreground"
							style={{ letterSpacing: 0.5 }}
						>
							OR CONTINUE WITH
						</Text>
					</View>
				</View>

				{/* Google Button */}
				<TouchableOpacity
					disabled={isLoading}
					className="flex-row items-center justify-center rounded-lg border border-border/60 bg-background"
					style={{
						height: 48,
						opacity: isLoading ? 0.5 : 1,
					}}
					activeOpacity={0.7}
				>
					<GoogleIcon />
					<Text className="text-base font-medium text-foreground">
						Continue with Google
					</Text>
				</TouchableOpacity>
			</View>

			{/* Switch to Sign Up */}
			<View className="items-center">
				<Text className="text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Text
						onPress={onSwitchToSignUp}
						className="font-semibold text-primary"
					>
						Create account
					</Text>
				</Text>
			</View>
		</View>
	);
}
