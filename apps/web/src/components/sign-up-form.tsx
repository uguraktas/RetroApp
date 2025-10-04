import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const t = useTranslations();
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success(t("auth.signUp.success"));
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, t("auth.validation.nameMin")),
				email: z.email(t("auth.validation.invalidEmail")),
				password: z.string().min(8, t("auth.validation.passwordMin")),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto w-full max-w-md">
			<div className="bg-card border rounded-2xl shadow-xl p-8">
				<div className="space-y-2 mb-8">
					<h1 className="text-3xl font-bold">{t("auth.signUp.title")}</h1>
					<p className="text-muted-foreground">
						{t("auth.signUp.subtitle")}
					</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-5"
				>
					<div>
						<form.Field name="name">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="text-sm font-medium">
										{t("common.name")}
									</Label>
									<Input
										id={field.name}
										name={field.name}
										placeholder={t("auth.signUp.namePlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="h-11"
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-sm text-destructive">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="email">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="text-sm font-medium">
										{t("common.email")}
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										placeholder={t("auth.signUp.emailPlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="h-11"
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-sm text-destructive">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="text-sm font-medium">
										{t("common.password")}
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="password"
										placeholder={t("auth.signUp.passwordPlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="h-11"
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-sm text-destructive">
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
								type="submit"
								className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
								disabled={!state.canSubmit || state.isSubmitting}
							>
								{state.isSubmitting ? t("auth.signUp.creatingAccount") : t("auth.signUp.signUp")}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-muted-foreground">
						{t("auth.signUp.haveAccount")}{" "}
						<Button
							variant="link"
							onClick={onSwitchToSignIn}
							className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
						>
							{t("auth.signUp.signIn")}
						</Button>
					</p>
				</div>
			</div>
		</div>
	);
}
