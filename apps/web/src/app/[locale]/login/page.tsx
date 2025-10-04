"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  const t = useTranslations();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="grid w-full max-w-6xl items-center gap-8 md:grid-cols-2">
        {/* Left side - Branding */}
        <div className="hidden flex-col gap-6 p-8 md:flex">
          <div className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="font-bold text-3xl text-white">T</span>
            </div>
            <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-4xl text-transparent">
              codebasehub
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("login.branding.subtitle")}
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {t("login.branding.features.lightningFast.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("login.branding.features.lightningFast.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <span className="text-lg">🔐</span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {t("login.branding.features.secureByDefault.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("login.branding.features.secureByDefault.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {t("login.branding.features.aiPowered.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("login.branding.features.aiPowered.description")}
                </p>
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
