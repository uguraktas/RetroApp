"use client";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import LanguageSwitcher from "./language-switcher";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "./ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  
  const links = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/ai", label: "AI Chat", icon: "✨" },
    { to: "/docs", label: "Docs", icon: "📚" },
    { to: "/blog", label: "Blog", icon: "📝" },
    { to: "/changelog", label: "Changelog", icon: "🚀" },
    { to: "/contact", label: "Contact", icon: "📧" },
  ] as const;

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = pathname === to;
    return (
      <Link
        className={`relative rounded-xl px-4 py-2.5 font-medium text-sm transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-primary/10 via-primary/5 to-orange-500/10 text-primary shadow-sm border border-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-orange-500/5"
        }`}
        href={to}
      >
        {label}
        {isActive && (
          <div className="absolute -bottom-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-orange-500" />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <Logo withLabel={false} className="sm:hidden" />
              <Logo withLabel className="hidden sm:flex transition-transform group-hover:scale-105" />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden gap-2 lg:flex">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to} label={label} />
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Desktop utilities */}
            <div className="hidden items-center gap-3 sm:flex">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
            <UserMenu />
            
            {/* Mobile menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-xl hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                {/* Mobile navigation */}
                {links.map(({ to, label, icon }, index) => {
                  const isActive = pathname === to;
                  return (
                    <DropdownMenuItem key={to} asChild>
                      <Link 
                        href={to}
                        className={`flex items-center gap-3 w-full ${
                          isActive ? "text-primary font-medium bg-primary/10" : ""
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <div className="flex items-center justify-center gap-2 px-3 py-2">
                  <LanguageSwitcher />
                  <ModeToggle />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
