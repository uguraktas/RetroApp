import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBlogPage, getBlogPages } from "@/lib/source";
import { useMDXComponents } from "../../../../../mdx-components";

type PageProps = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function BlogPost({ params }: PageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations();

  // If no slug provided, show blog listing
  if (!slug || slug.length === 0) {
    return <BlogListingPage locale={locale} />;
  }

  const page = getBlogPage(slug, locale);

  if (!page) {
    notFound();
  }

  const Mdx = page.data.body;

  // Type assertion for blog metadata
  const blogData = page.data as any;

  // Get related posts (simple implementation)
  const allPosts = getBlogPages()
    .filter((p) => p.locale === locale && p.url !== page.url)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-12">
          {/* Back to Blog */}
          <div className="flex items-center gap-2">
            <Link
              className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
              href="/blog"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              {t("blog.back")}
            </Link>
          </div>

          {/* Blog Post */}
          <article className="space-y-8">
            {/* Enhanced header */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {blogData.icon && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                    <span className="text-primary-foreground">
                      {blogData.icon}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
                    <span>
                      {blogData.date || new Date().toLocaleDateString()}
                    </span>
                    {blogData.category && (
                      <>
                        <span>•</span>
                        <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                          {blogData.category}
                        </span>
                      </>
                    )}
                    {blogData.author && (
                      <>
                        <span>•</span>
                        <span>
                          {t("blog.author")} {blogData.author}
                        </span>
                      </>
                    )}
                  </div>
                  <h1 className="font-bold text-4xl leading-tight tracking-tight md:text-5xl">
                    {page.data.title}
                  </h1>
                  {page.data.description && (
                    <p className="mt-4 text-muted-foreground text-xl leading-relaxed">
                      {page.data.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Featured image placeholder */}
            <div className="relative h-64 overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                  <svg
                    className="h-8 w-8 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Blog content */}
            <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
              <Mdx components={useMDXComponents({})} />
            </div>
          </article>

          {/* Related Posts */}
          {allPosts.length > 0 && (
            <div className="border-t pt-12">
              <div className="space-y-8">
                <h2 className="font-bold text-2xl">{t("blog.relatedPosts")}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {allPosts.map((post) => {
                    const relatedPostData = post.data as any;
                    return (
                      <Link href={post.url as any} key={post.url}>
                        <Card className="group h-full border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                          <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
                              {post.data.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-2 text-sm">
                              {post.data.description || t("blog.clickToRead")}
                            </CardDescription>
                            <div className="mt-3 flex items-center gap-2 text-muted-foreground text-xs">
                              <span>
                                {relatedPostData.date || t("blog.recent")}
                              </span>
                              {relatedPostData.category && (
                                <>
                                  <span>•</span>
                                  <span>{relatedPostData.category}</span>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return getBlogPages().map((page) => ({
    slug: page.slugs,
    locale: page.locale,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations();

  // If no slug, return metadata for blog listing page
  if (!slug || slug.length === 0) {
    return {
      title: t("blog.metaTitle"),
      description: t("blog.description"),
      openGraph: {
        title: t("blog.metaTitle"),
        description: t("blog.description"),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: t("blog.metaTitle"),
        description: t("blog.description"),
      },
    };
  }

  const page = getBlogPage(slug, locale);

  if (!page) {
    notFound();
  }

  const blogData = page.data as any;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",
      publishedTime: blogData.date,
      authors: blogData.author ? [blogData.author] : ["CodeBaseHub Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
    },
  };
}

// Blog Listing Component
async function BlogListingPage({ locale }: { locale: string }) {
  const t = await getTranslations();
  // Get blog posts for the current locale
  const blogPosts = getBlogPages().filter(
    (page) => page.locale === locale || (!page.locale && locale === "en")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-12">
          {/* Enhanced Hero Section */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                <svg
                  className="h-8 w-8 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-bold text-4xl tracking-tight md:text-6xl">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-orange-500 bg-clip-text text-transparent">
                  {t("blog.title")}
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground text-xl leading-relaxed">
                {t("blog.description")}
              </p>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {blogPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => {
                const postData = post.data as any;
                return (
                  <Link href={post.url as any} key={post.url}>
                    <Card className="group relative h-full overflow-hidden border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                      {/* Featured Image Placeholder */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-4 left-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                            {postData.icon ? (
                              <span className="text-primary-foreground">
                                {postData.icon}
                              </span>
                            ) : (
                              <svg
                                className="h-5 w-5 text-primary-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      <CardHeader className="pb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span>{postData.date || t("blog.recent")}</span>
                            {postData.category && (
                              <>
                                <span>•</span>
                                <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                                  {postData.category}
                                </span>
                              </>
                            )}
                          </div>
                          <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                            {post.data.title}
                          </CardTitle>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <CardDescription className="line-clamp-3 text-base leading-relaxed">
                          {post.data.description || t("blog.clickToReadMore")}
                        </CardDescription>

                        <div className="mt-4 flex items-center gap-2 text-sm">
                          <span className="font-medium text-primary">
                            {t("blog.readMore")}
                          </span>
                          <svg
                            className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                      </CardContent>

                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-orange-500/40 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            // Empty state
            <div className="py-16 text-center">
              <Card className="mx-auto max-w-md border bg-gradient-to-r from-muted/20 to-muted/10">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 text-primary">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">
                      {t("blog.emptyTitle")}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t("blog.emptyDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
