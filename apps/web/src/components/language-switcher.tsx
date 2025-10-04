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

const LANGUAGE_NAMES: Record<string, string> = {
	en: "English",
	tr: "Türkçe",
	ar: "العربية",
};

export default function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	const [isPending, startTransition] = useTransition();

	const currentLocale = (params.locale as string) || config.i18n.default;
	const supportedLocales = config.i18n.supported;

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
							{LANGUAGE_NAMES[locale] || locale.toUpperCase()}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
