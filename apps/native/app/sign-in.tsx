import { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function SignInScreen() {
	const [showSignIn, setShowSignIn] = useState(true);
	const router = useRouter();
	const { data: session } = authClient.useSession();

	// Redirect to home if already authenticated
	useEffect(() => {
		if (session) {
			router.replace("/(app)");
		}
	}, [session]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-background"
		>
			<ScrollView
				className="flex-1"
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					paddingHorizontal: 16,
					paddingVertical: 32,
				}}
			>
				<View className="mx-auto w-full max-w-md">
					{showSignIn ? (
						<SignIn onSwitchToSignUp={() => setShowSignIn(false)} />
					) : (
						<SignUp onSwitchToSignIn={() => setShowSignIn(true)} />
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
