import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Globe, Server, Smartphone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { pageTree } from "@/lib/source";
import "./docs.css";

type DocsLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({
  children,
  params,
}: DocsLayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  return (
    <DocsLayout
      nav={{
        enabled: true,
        children: (
          <Link
            className="flex items-center gap-2 px-4 py-3"
            href={`/${locale}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="font-bold text-lg text-white">C</span>
            </div>
            <span className="font-bold text-lg">CodeBaseHub</span>
          </Link>
        ),
      }}
      sidebar={{
        tabs: [
          {
            title: "Web",
            url: `/${locale}/docs/web`,
            urls: new Set([`/${locale}/docs/web`, "/docs/web"]),
            icon: <Globe />,
          },
          {
            title: "Server",
            url: `/${locale}/docs/server`,
            urls: new Set([`/${locale}/docs/server`, "/docs/server"]),
            icon: <Server />,
          },
          {
            title: "Mobile",
            url: `/${locale}/docs/mobile`,
            urls: new Set([`/${locale}/docs/mobile`, "/docs/mobile"]),
            icon: <Smartphone />,
          },
        ],
      }}
      tree={pageTree[locale]}
    >
      {children}
    </DocsLayout>
  );
}
