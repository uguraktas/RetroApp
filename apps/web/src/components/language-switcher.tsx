"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { config } from "@repo/config";
import { useRouter, usePathname } from "@/i18n/routing";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	const [isPending, startTransition] = useTransition();

	const currentLocale = (params.locale as string) || config.i18n.default;
	const supportedLocales = Object.keys(config.i18n.locales);
	const localeNames = config.i18n.locales;

	if (supportedLocales.length <= 1) {
		return null;
	}

	const handleLocaleChange = (locale: string) => {
		startTransition(() => {
			router.replace(pathname, { locale });
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="Select language"
					disabled={isPending}
					size="icon"
					type="button"
					variant="ghost"
					className="rounded-xl hover:bg-primary/10"
				>
					<Globe className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{supportedLocales.map((locale) => {
					const isActive = currentLocale === locale;
					return (
						<DropdownMenuItem
							key={locale}
							className={isActive ? "bg-accent" : ""}
							onClick={() => {
								handleLocaleChange(locale);
							}}
						>
							{localeNames[locale as keyof typeof localeNames] || locale.toUpperCase()}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
