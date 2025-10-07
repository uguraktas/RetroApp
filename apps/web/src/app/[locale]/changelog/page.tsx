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
      description: "Updated navbar with new navigation items and improved dashboard access. Enhanced user experience with modern design patterns and better accessibility.",
      type: "feature",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      version: "v1.1.0", 
      date: "2024-09-29",
      title: "AI Chat Integration",
      description: "Added AI-powered chat functionality with improved user experience. Smart responses, context awareness, and seamless integration with your workflow.",
      type: "feature",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      version: "v1.0.0",
      date: "2024-09-15", 
      title: "Initial Release",
      description: "First stable release with authentication, dashboard, and core features. Complete SaaS starter kit with modern tech stack and production-ready setup.",
      type: "release",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-12">
          {/* Enhanced Hero Section */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-bold text-4xl md:text-6xl tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-orange-500 bg-clip-text text-transparent">
                  Changelog
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stay updated with the latest features, improvements, and releases. Track our journey as we build the ultimate SaaS starter kit.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-orange-500"></div>
            
            <div className="space-y-8">
              {updates.map((update, index) => (
                <div key={update.version} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 flex h-4 w-4 items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-primary to-orange-500 shadow-lg"></div>
                  </div>
                  
                  {/* Content */}
                  <Card className="ml-16 border-2 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 text-primary">
                            {update.icon}
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-xl font-bold">
                              {update.title}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="font-mono bg-muted px-2 py-1 rounded-md font-medium">
                                {update.version}
                              </span>
                              <span>•</span>
                              <span>{new Date(update.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
                          update.type === 'feature' 
                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20'
                            : 'bg-gradient-to-r from-green-500/10 to-green-500/5 text-green-600 border border-green-500/20 dark:text-green-400'
                        }`}>
                          {update.type === 'feature' ? '✨ Feature' : '🚀 Release'}
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

          {/* Call to Action */}
          <div className="text-center">
            <Card className="border-2 bg-gradient-to-r from-primary/5 via-primary/5 to-orange-500/5 border-primary/20">
              <CardContent className="py-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                      <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7.5C0 3.36 3.36 0 7.5 0S15 3.36 15 7.5v9.5z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl">Stay in the Loop</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Follow our development journey and be the first to know about new features and improvements.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a 
                      href="/docs" 
                      className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      📚 Documentation
                    </a>
                    <a 
                      href="/contact" 
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-orange-500 px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:from-primary/90 hover:to-orange-600 shadow-lg hover:scale-105"
                    >
                      💬 Give Feedback
                    </a>
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
