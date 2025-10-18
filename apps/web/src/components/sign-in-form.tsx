import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { AppleIcon } from "./icons/apple-icon";
import { GoogleIcon } from "./icons/google-icon";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { isPending } = authClient.useSession();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success(t("auth.signIn.success"));
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email(t("auth.validation.invalidEmail")),
        password: z.string().min(8, t("auth.validation.passwordMin")),
      }),
    },
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { message?: string } })?.error?.message ||
        t("signIn.errors.googleSignInFailed");
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "apple",
        callbackURL: "/dashboard",
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { message?: string } })?.error?.message ||
        t("signIn.errors.appleSignInFailed");
      toast.error(errorMessage);
    } finally {
      setIsAppleLoading(false);
    }
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-3xl tracking-tight">
          {t("auth.signIn.title")}
        </h1>
        <p className="text-muted-foreground">{t("auth.signIn.description")}</p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border bg-card p-8 shadow-lg">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4">
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor={field.name}>
                    {t("auth.signIn.emailLabel")}
                  </Label>
                  <Input
                    className="h-12 text-base"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("auth.signIn.emailPlaceholder")}
                    type="email"
                    value={field.state.value}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p
                      className="text-destructive text-sm"
                      key={error?.message}
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium text-sm" htmlFor={field.name}>
                      {t("auth.signIn.passwordLabel")}
                    </Label>
                    <Button
                      className="h-auto p-0 text-muted-foreground text-sm hover:text-primary"
                      type="button"
                      variant="link"
                    >
                      {t("auth.signIn.forgotPassword")}
                    </Button>
                  </div>
                  <Input
                    className="h-12 text-base"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("auth.signIn.passwordPlaceholder")}
                    type="password"
                    value={field.state.value}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p
                      className="text-destructive text-sm"
                      key={error?.message}
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe>
            {(state) => (
              <Button
                className="h-12 w-full bg-gradient-to-r from-primary via-primary/90 to-orange-500 font-medium text-base hover:from-primary/90 hover:to-orange-600"
                disabled={!state.canSubmit || state.isSubmitting}
                type="submit"
              >
                {state.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("auth.signIn.signingIn")}
                  </div>
                ) : (
                  t("auth.signIn.signInButton")
                )}
              </Button>
            )}
          </form.Subscribe>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t("auth.signIn.orContinueWith")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="h-12 w-full font-medium text-base"
              disabled={isGoogleLoading || isAppleLoading}
              onClick={handleGoogleSignIn}
              type="button"
              variant="outline"
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  {t("auth.signIn.signingIn")}
                </div>
              ) : (
                <>
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  {t("auth.signIn.continueWithGoogle")}
                </>
              )}
            </Button>

            <Button
              className="h-12 w-full font-medium text-base"
              disabled={isGoogleLoading || isAppleLoading}
              onClick={handleAppleSignIn}
              type="button"
              variant="outline"
            >
              {isAppleLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  {t("auth.signIn.signingIn")}
                </div>
              ) : (
                <>
                  <AppleIcon className="mr-2 h-5 w-5" />
                  {t("auth.signIn.continueWithApple")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Switch to Sign Up */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          {t("auth.signIn.noAccount")}{" "}
          <Button
            className="h-auto p-0 font-semibold text-primary hover:text-primary/80"
            onClick={onSwitchToSignUp}
            variant="link"
          >
            {t("auth.signIn.createAccount")}
          </Button>
        </p>
      </div>
    </div>
  );
}
