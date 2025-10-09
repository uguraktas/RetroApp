"use client";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Changelog() {
  const t = useTranslations();

  const updates = [
    {
      version: "v1.2.0",
      date: "2024-10-05",
      title: "Dashboard & Navigation Improvements",
      description:
        "Updated navbar with new navigation items and improved dashboard access. Enhanced user experience with modern design patterns and better accessibility.",
      type: "feature",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M13 10V3L4 14h7v7l9-11h-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
    },
    {
      version: "v1.0.0",
      date: "2024-09-15",
      title: "Initial Release",
      description:
        "First stable release with authentication, dashboard, and core features. Complete SaaS starter kit with modern tech stack and production-ready setup.",
      type: "release",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-16">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                  {t("changelog.title")}
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground text-xl leading-relaxed">
                {t("changelog.description")}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-orange-500" />

            <div className="space-y-8">
              {updates.map((update, index) => (
                <div className="relative" key={update.version}>
                  {/* Timeline dot */}
                  <div className="absolute top-6 left-6 flex h-4 w-4 items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-primary to-orange-500 shadow-lg" />
                  </div>

                  {/* Content */}
                  <Card className="ml-16 border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 text-primary">
                            {update.icon}
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="font-bold text-xl">
                              {update.title}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-muted-foreground text-sm">
                              <span className="rounded-md bg-muted px-2 py-1 font-medium font-mono">
                                {update.version}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(update.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 font-medium text-xs shadow-sm ${
                            update.type === "feature"
                              ? "border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                              : "border border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-500/5 text-green-600 dark:text-green-400"
                          }`}
                        >
                          {update.type === "feature"
                            ? "✨ Feature"
                            : "🚀 Release"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-7">
                        {update.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
