import { DocsBody, DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPage, getPages } from "@/lib/source";
import { useMDXComponents } from "../../../../../mdx-components";

type PageProps = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params;
  const page = getPage(slug, locale);

  if (!page) {
    notFound();
  }

  const t = await getTranslations();
  const Mdx = page.data.body;

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <DocsBody>
        {/* Enhanced header with gradient accent */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            {page.data.icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                <span className="text-primary-foreground">
                  {page.data.icon}
                </span>
              </div>
            )}
            <div>
              <h1 className="font-bold text-4xl tracking-tight">
                {page.data.title}
              </h1>
              {page.data.description && (
                <p className="mt-2 text-muted-foreground text-xl leading-relaxed">
                  {page.data.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced MDX content with custom components */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Mdx components={useMDXComponents({})} />
        </div>

        {/* Enhanced page navigation */}
        <div className="mt-16 border-t pt-8">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span>{t("docs.wasHelpful")}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              type="button"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              {t("docs.yes")}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              type="button"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M5 4H3a2 2 0 00-2 2v6a2 2 0 002 2h2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              {t("docs.no")}
            </button>
          </div>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
    locale: page.locale,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const page = getPage(slug, locale);

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
