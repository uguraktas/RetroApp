"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  const features = [
    {
      title: "Fast & Reliable",
      description:
        "Built with Next.js and tRPC for maximum performance and type safety",
      icon: "⚡",
    },
    {
      title: "Secure Authentication",
      description:
        "Enterprise-grade authentication with Better Auth integration",
      icon: "🔐",
    },
    {
      title: "AI-Powered",
      description:
        "Integrated AI chat capabilities for enhanced user experience",
      icon: "🤖",
    },
  ] as const;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-4">
            <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text font-bold text-4xl text-transparent tracking-tight md:text-6xl">
              Welcome to codebasehub
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl md:text-2xl">
              A modern, full-stack application with AI capabilities, secure
              authentication, and beautiful design
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/ai">Try AI Chat</Link>
            </Button>
          </div>

          {/* API Status Badge */}
          <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? "animate-pulse bg-green-500" : "bg-red-500"}`}
            />
            <span className="font-medium text-sm">
              API{" "}
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-6xl border-t px-4 py-16">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="font-bold text-3xl md:text-4xl">Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to build modern web applications
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                className="border-2 transition-colors hover:border-primary/50"
                key={feature.title}
              >
                <CardHeader>
                  <div className="mb-2 text-4xl">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-6xl border-t px-4 py-16">
        <Card className="border-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <h2 className="font-bold text-3xl md:text-4xl">
                Ready to get started?
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground">
                Sign in to access your dashboard, manage your subscriptions, and
                explore AI-powered features
              </p>
              <Button asChild className="mt-2" size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
