import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
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

          <Button
            className="h-12 w-full font-medium text-base"
            type="button"
            variant="outline"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("auth.signIn.continueWithGoogle")}
          </Button>
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
