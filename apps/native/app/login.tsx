import { useState } from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";

export default function LoginScreen() {
	const [showSignIn, setShowSignIn] = useState(true);

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
