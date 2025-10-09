import type { DocsLayoutProps as FumadocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Link } from "@/i18n/routing";
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
  const t = await getTranslations();

  const baseOptions: Omit<FumadocsLayoutProps, "tree" | "children"> = {
    nav: {
      enabled: true,
      title: <Logo withLabel />,
      transparentMode: "top",
    },
    sidebar: {
      footer: (
        <div className="border-t p-4">
          <div className="rounded-xl border bg-gradient-to-r from-primary/5 via-primary/5 to-orange-500/5 p-4 text-center">
            <p className="font-semibold text-sm">{t("docs.needHelp")}</p>
            <p className="mb-3 text-muted-foreground text-xs">
              {t("docs.joinCommunity")}
            </p>
            <Link
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary via-primary/90 to-orange-500 px-3 py-2 font-medium text-primary-foreground text-xs transition-all hover:from-primary/90 hover:to-orange-600"
              href="/contact"
            >
              {t("docs.getSupport")}
            </Link>
          </div>
        </div>
      ),
    },
  };

  return (
    <DocsLayout tree={pageTree[locale]} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
