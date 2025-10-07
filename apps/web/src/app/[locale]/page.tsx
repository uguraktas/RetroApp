"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const t = useTranslations();
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  const features = [
    {
      title: "Lightning Fast",
      description: "Built with performance in mind. TypeScript, Next.js 15, and optimized for speed.",
      icon: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
          <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Secure by Default",
      description: "Enterprise-grade authentication, RBAC, and security best practices built in.",
      icon: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      ),
    },
    {
      title: "AI Integration",
      description: "Ready-to-use AI chat functionality with modern UI and streaming responses.",
      icon: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      ),
    },
  ] as const;

  const techStack = [
    { name: "Next.js 15", description: "React framework" },
    { name: "TypeScript", description: "Type safety" },
    { name: "Tailwind CSS", description: "Styling" },
    { name: "shadcn/ui", description: "Components" },
    { name: "tRPC", description: "Type-safe API" },
    { name: "Prisma", description: "Database ORM" },
  ] as const;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="container relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
              <div
                className={`h-2 w-2 rounded-full ${healthCheck.data ? "animate-pulse bg-green-500" : "bg-red-500"}`}
              />
              <span className="font-medium">
                {healthCheck.isLoading
                  ? "Checking API..."
                  : healthCheck.data
                    ? "All systems operational"
                    : "API disconnected"}
              </span>
            </div>
            
            <div className="space-y-6">
              <h1 className="font-bold text-5xl tracking-tight md:text-7xl">
                Build faster with{" "}
                <span className="bg-gradient-to-r from-primary via-primary/90 to-orange-500 bg-clip-text text-transparent">
                  modern tools
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground text-xl leading-relaxed md:text-2xl">
                A production-ready starter kit with authentication, AI integration, 
                and everything you need to ship fast. Built by developers, for developers.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <Link href="/ai">Try AI Chat</Link>
              </Button>
            </div>

            <div className="mt-12 text-center">
              <p className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
                Trusted by developers
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
                {techStack.map((tech) => (
                  <div key={tech.name} className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{tech.name}</span>
                    <span className="hidden text-muted-foreground text-xs sm:inline">
                      {tech.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-bold text-4xl md:text-5xl">
              Everything you need to{" "}
              <span className="text-primary">ship fast</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
              Skip the boilerplate. Start with a foundation that scales.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h3 className="font-bold text-3xl md:text-4xl">
                Developer experience{" "}
                <span className="text-primary">first</span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Type-safe APIs, modern tooling, and best practices built in. 
                Focus on building features, not configuration.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500/20">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Full TypeScript support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500/20">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>tRPC for end-to-end type safety</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500/20">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Prisma ORM with migrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500/20">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>ESLint & Prettier configured</span>
                </div>
              </div>
            </div>
            
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-muted/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-4 font-mono text-muted-foreground text-sm">api/users.ts</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="overflow-x-auto bg-card p-6 font-mono text-sm">
                  <code className="text-foreground">
{`import { z } from 'zod'
import { publicProcedure } from '../trpc'

export const userRouter = {
  getProfile: publicProcedure
    .input(z.object({
      userId: z.string().uuid()
    }))
    .query(async ({ input }) => {
      return await db.user.findUnique({
        where: { id: input.userId }
      })
    })
}`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="space-y-8">
            <h2 className="font-bold text-4xl md:text-5xl">
              Ready to build something{" "}
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                amazing?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
              Join thousands of developers who ship faster with our modern starter kit.
              Get started in minutes, not hours.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/dashboard">Start Building Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <Link href="/docs">View Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
