"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    alert("Form submitted! (This is a placeholder)");
  };

  const contactMethods = [
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
      title: t("contact.methods.email.title"),
      description: t("contact.methods.email.description"),
      contact: "support@codebasehub.com",
      color: "primary",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
      title: t("contact.methods.chat.title"),
      description: t("contact.methods.chat.description"),
      contact: t("contact.methods.chat.contact"),
      color: "green",
    },
  ];

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
                    d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
                  {t("contact.title")}
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground text-xl leading-relaxed">
                {t("contact.description")}
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card className="border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 text-primary">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {t("contact.form.title")}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {t("contact.form.description")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-semibold text-sm" htmlFor="name">
                          {t("contact.form.fullName")}
                        </Label>
                        <Input
                          className="h-12 rounded-xl border-2 focus:border-primary/50"
                          id="name"
                          placeholder={t("contact.form.fullNamePlaceholder")}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          className="font-semibold text-sm"
                          htmlFor="email"
                        >
                          {t("contact.form.email")}
                        </Label>
                        <Input
                          className="h-12 rounded-xl border-2 focus:border-primary/50"
                          id="email"
                          placeholder={t("contact.form.emailPlaceholder")}
                          required
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        className="font-semibold text-sm"
                        htmlFor="message"
                      >
                        {t("contact.form.message")}
                      </Label>
                      <Textarea
                        className="rounded-xl border-2 focus:border-primary/50"
                        id="message"
                        placeholder={t("contact.form.messagePlaceholder")}
                        required
                        rows={6}
                      />
                    </div>
                    <Button
                      className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-primary/90 to-orange-500 font-semibold shadow-lg transition-all hover:scale-[1.02] hover:from-primary/90 hover:to-orange-600"
                      type="submit"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      {t("contact.form.submit")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Methods - Takes 1 column */}
            <div className="space-y-6">
              <Card className="border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 text-primary">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    {t("contact.methods.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("contact.methods.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div
                      className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 p-4 transition-all hover:from-primary/5 hover:to-orange-500/5"
                      key={index}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-${method.color === "primary" ? "primary" : method.color === "green" ? "green-500" : "purple-500"}/10 to-${method.color === "primary" ? "primary" : method.color === "green" ? "green-500" : "purple-500"}/5 text-${method.color === "primary" ? "primary" : method.color === "green" ? "green-600" : "purple-600"} shadow-sm`}
                      >
                        {method.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm">{method.title}</p>
                        <p className="mb-1 text-muted-foreground text-xs">
                          {method.description}
                        </p>
                        <p className="break-all font-mono text-primary text-xs">
                          {method.contact}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Response Time Info */}
              <Card className="border border-muted bg-gradient-to-r from-muted/20 to-muted/10">
                <CardContent className="p-4">
                  <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      <span className="font-semibold">
                        {t("contact.responseTime.title")}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {t("contact.responseTime.description")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
