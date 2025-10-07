import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "@/i18n/routing";
import Link from "next/link";
import { LogIn, LayoutDashboard } from "lucide-react";

export default function UserMenu() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-10 w-28 rounded-xl" />;
	}

	if (!session) {
		return (
			<Button 
				variant="outline" 
				asChild
				className="rounded-xl border-primary/20 bg-gradient-to-r from-primary/5 to-orange-500/5 hover:from-primary/10 hover:to-orange-500/10 transition-all duration-300"
			>
				<Link href="/login" className="flex items-center gap-2">
					<LogIn className="h-4 w-4" />
					<span className="font-medium">Sign In</span>
				</Link>
			</Button>
		);
	}

	return (
		<Button 
			variant="default" 
			asChild
			className="rounded-xl bg-gradient-to-r from-primary via-primary/90 to-orange-500 hover:from-primary/90 hover:to-orange-600 shadow-lg transition-all duration-300 hover:scale-105"
		>
			<Link href="/dashboard" className="flex items-center gap-2">
				<LayoutDashboard className="h-4 w-4" />
				<span className="font-medium">Dashboard</span>
			</Link>
		</Button>
	);
}
