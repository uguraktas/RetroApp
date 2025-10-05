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
      description: "Updated navbar with new navigation items and improved dashboard access",
      type: "feature"
    },
    {
      version: "v1.1.0", 
      date: "2024-09-29",
      title: "AI Chat Integration",
      description: "Added AI-powered chat functionality with improved user experience",
      type: "feature"
    },
    {
      version: "v1.0.0",
      date: "2024-09-15", 
      title: "Initial Release",
      description: "First stable release with authentication, dashboard, and core features",
      type: "release"
    }
  ] as const;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-4xl md:text-5xl">Changelog</h1>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest features and improvements
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((update) => (
            <Card key={update.version} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {update.title}
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        update.type === 'feature' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {update.type}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono">{update.version}</span>
                      <span>•</span>
                      <span>{update.date}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {update.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
