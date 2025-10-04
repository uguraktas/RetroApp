"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  const features = [
    {
      title: "Fast & Reliable",
      description: "Built with Next.js and tRPC for maximum performance and type safety",
      icon: "⚡",
    },
    {
      title: "Secure Authentication",
      description: "Enterprise-grade authentication with Better Auth integration",
      icon: "🔐",
    },
    {
      title: "AI-Powered",
      description: "Integrated AI chat capabilities for enhanced user experience",
      icon: "🤖",
    },
  ] as const;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to my-better-t-app
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A modern, full-stack application with AI capabilities, secure authentication, and beautiful design
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/ai">Try AI Chat</Link>
            </Button>
          </div>

          {/* API Status Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-card">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
            />
            <span className="text-sm font-medium">
              API {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16 border-t">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to build modern web applications
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
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
      <section className="container mx-auto max-w-6xl px-4 py-16 border-t">
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-2">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Sign in to access your dashboard, manage your subscriptions, and explore AI-powered features
              </p>
              <Button asChild size="lg" className="mt-2">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
