"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const pathname = usePathname();
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
		{ to: "/ai", label: "AI Chat" },
	] as const;

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="container mx-auto max-w-7xl">
				<div className="flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-8">
						<Link href="/" className="flex items-center gap-2">
							<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
								<span className="text-white font-bold text-lg">T</span>
							</div>
							<span className="font-semibold text-xl hidden sm:inline-block">
								my-better-t-app
							</span>
						</Link>
						<nav className="hidden md:flex gap-1">
							{links.map(({ to, label }) => {
								const isActive = pathname === to;
								return (
									<Link
										key={to}
										href={to}
										className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
											isActive
												? "bg-secondary text-foreground"
												: "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
										}`}
									>
										{label}
									</Link>
								);
							})}
						</nav>
					</div>
					<div className="flex items-center gap-3">
						<ModeToggle />
						<UserMenu />
					</div>
				</div>
			</div>
		</header>
	);
}
