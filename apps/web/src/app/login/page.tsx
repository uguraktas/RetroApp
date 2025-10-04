"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";

export default function LoginPage() {
	const [showSignIn, setShowSignIn] = useState(false);

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4">
			<div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
				{/* Left side - Branding */}
				<div className="hidden md:flex flex-col gap-6 p-8">
					<div className="space-y-4">
						<div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
							<span className="text-white font-bold text-3xl">T</span>
						</div>
						<h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							my-better-t-app
						</h2>
						<p className="text-lg text-muted-foreground">
							Build faster with our modern full-stack platform featuring AI capabilities,
							secure authentication, and beautiful UI components.
						</p>
					</div>
					<div className="space-y-4 mt-8">
						<div className="flex items-start gap-3">
							<div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
								<span className="text-lg">⚡</span>
							</div>
							<div>
								<h3 className="font-semibold">Lightning Fast</h3>
								<p className="text-sm text-muted-foreground">Built with Next.js and modern tools</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
								<span className="text-lg">🔐</span>
							</div>
							<div>
								<h3 className="font-semibold">Secure by Default</h3>
								<p className="text-sm text-muted-foreground">Enterprise-grade authentication</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="h-8 w-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
								<span className="text-lg">🤖</span>
							</div>
							<div>
								<h3 className="font-semibold">AI-Powered</h3>
								<p className="text-sm text-muted-foreground">Integrated AI chat capabilities</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right side - Forms */}
				<div className="w-full">
					{showSignIn ? (
						<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
					) : (
						<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
					)}
				</div>
			</div>
		</div>
	);
}
