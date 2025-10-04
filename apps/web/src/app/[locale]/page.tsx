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
      title: t("home.features.fastReliable.title"),
      description: t("home.features.fastReliable.description"),
      icon: "⚡",
    },
    {
      title: t("home.features.secureAuth.title"),
      description: t("home.features.secureAuth.description"),
      icon: "🔐",
    },
    {
      title: t("home.features.aiPowered.title"),
      description: t("home.features.aiPowered.description"),
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
              {t("home.hero.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl md:text-2xl">
              {t("home.hero.subtitle")}
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">{t("home.hero.getStarted")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/ai">{t("home.hero.tryAiChat")}</Link>
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
                ? t("home.apiStatus.checking")
                : healthCheck.data
                  ? t("home.apiStatus.connected")
                  : t("home.apiStatus.disconnected")}
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-6xl border-t px-4 py-16">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="font-bold text-3xl md:text-4xl">
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("home.features.subtitle")}
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
                {t("home.cta.title")}
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground">
                {t("home.cta.subtitle")}
              </p>
              <Button asChild className="mt-2" size="lg">
                <Link href="/dashboard">{t("home.cta.goToDashboard")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
