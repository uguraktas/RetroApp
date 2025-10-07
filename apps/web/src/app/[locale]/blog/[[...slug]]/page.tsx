import { getBlogPage, getBlogPages } from "@/lib/source";
import type { Metadata } from "next";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { useMDXComponents } from "../../../../../mdx-components";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PageProps = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function BlogPost({ params }: PageProps) {
  const { slug, locale } = await params;
  
  // If no slug provided, show blog listing
  if (!slug || slug.length === 0) {
    return <BlogListingPage locale={locale} />;
  }
  
  const page = getBlogPage(slug, locale);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  
  // Type assertion for blog metadata
  const blogData = page.data as any;

  // Get related posts (simple implementation)
  const allPosts = getBlogPages().filter(p => 
    p.locale === locale && p.url !== page.url
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-12">
          {/* Back to Blog */}
          <div className="flex items-center gap-2">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{blogData.date || new Date().toLocaleDateString()}</span>
                    {blogData.category && (
                      <>
                        <span>•</span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                          {blogData.category}
                        </span>
                      </>
                    )}
                    {blogData.author && (
                      <>
                        <span>•</span>
                        <span>by {blogData.author}</span>
                      </>
                    )}
                  </div>
                  <h1 className="font-bold text-4xl md:text-5xl tracking-tight leading-tight">{page.data.title}</h1>
                  {page.data.description && (
                    <p className="text-muted-foreground text-xl mt-4 leading-relaxed">
                      {page.data.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Featured image placeholder */}
            <div className="h-64 md:h-80 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 relative overflow-hidden border-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                  <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Blog content */}
            <div className="prose prose-neutral max-w-none dark:prose-invert prose-lg">
              <MDX components={useMDXComponents({})} />
            </div>

            {/* Author and sharing section */}
            <div className="border-t pt-8">
              <Card className="bg-gradient-to-r from-muted/20 to-muted/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 text-primary">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">{blogData.author || 'CodeBaseHub Team'}</p>
                        <p className="text-sm text-muted-foreground">
                          Building modern development tools
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Share:</span>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Was this helpful section */}
            <div className="border-t pt-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Was this post helpful?</span>
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Yes
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M5 4H3a2 2 0 00-2 2v6a2 2 0 002 2h2.5" />
                    </svg>
                    No
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {allPosts.length > 0 && (
            <div className="border-t pt-12">
              <div className="space-y-8">
                <h2 className="font-bold text-2xl">Related Posts</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {allPosts.map((post) => {
                    const relatedPostData = post.data as any;
                    return (
                      <Link key={post.url} href={post.url as any}>
                        <Card className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg bg-gradient-to-br from-card to-card/50 h-full">
                          <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                              {post.data.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm line-clamp-2">
                              {post.data.description || 'Click to read more...'}
                            </CardDescription>
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{relatedPostData.date || 'Recent'}</span>
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
  
  // If no slug, return metadata for blog listing page
  if (!slug || slug.length === 0) {
    return {
      title: 'Blog - CodeBaseHub',
      description: 'Insights, tutorials, and updates from the CodeBaseHub team. Learn about modern development practices and stay up to date with our latest features.',
      openGraph: {
        title: 'Blog - CodeBaseHub',
        description: 'Insights, tutorials, and updates from the CodeBaseHub team. Learn about modern development practices and stay up to date with our latest features.',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog - CodeBaseHub',
        description: 'Insights, tutorials, and updates from the CodeBaseHub team. Learn about modern development practices and stay up to date with our latest features.',
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
      type: 'article',
      publishedTime: blogData.date,
      authors: blogData.author ? [blogData.author] : ['CodeBaseHub Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
    },
  };
}

// Blog Listing Component
function BlogListingPage({ locale }: { locale: string }) {
  // Get blog posts for the current locale
  const blogPosts = getBlogPages().filter(page => 
    page.locale === locale || (!page.locale && locale === 'en')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-12">
          {/* Enhanced Hero Section */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-bold text-4xl md:text-6xl tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-orange-500 bg-clip-text text-transparent">
                  Our Blog
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Insights, tutorials, and updates from the CodeBaseHub team. 
                Learn about modern development practices and stay up to date with our latest features.
              </p>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {blogPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => {
                const postData = post.data as any;
                return (
                  <Link key={post.url} href={post.url as any}>
                    <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl bg-gradient-to-br from-card to-card/50 h-full">
                      {/* Featured Image Placeholder */}
                      <div className="h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                            {postData.icon ? (
                              <span className="text-primary-foreground">{postData.icon}</span>
                            ) : (
                              <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{postData.date || 'Recent'}</span>
                            {postData.category && (
                              <>
                                <span>•</span>
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                                  {postData.category}
                                </span>
                              </>
                            )}
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                            {post.data.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed line-clamp-3">
                          {post.data.description || 'Click to read more about this post...'}
                        </CardDescription>
                        
                        <div className="mt-4 flex items-center gap-2 text-sm">
                          <span className="text-primary font-medium">Read more</span>
                          <svg className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
            <div className="text-center py-16">
              <Card className="mx-auto max-w-md border bg-gradient-to-r from-muted/20 to-muted/10">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 text-primary">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">Coming Soon!</h3>
                    <p className="text-muted-foreground text-sm">
                      We're working on some amazing blog posts. Check back soon for the latest insights and tutorials.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="text-center">
            <Card className="border-2 bg-gradient-to-r from-primary/5 via-primary/5 to-orange-500/5 border-primary/20">
              <CardContent className="py-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                      <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl">Stay Updated</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Get notified when we publish new posts about modern development practices and product updates.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center justify-center rounded-xl border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      📧 Subscribe to Updates
                    </Link>
                    <Link 
                      href="/docs" 
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary via-primary/90 to-orange-500 px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:from-primary/90 hover:to-orange-600 shadow-lg hover:scale-105"
                    >
                      📚 Browse Documentation
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
