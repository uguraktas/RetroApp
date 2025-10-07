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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@codebasehub.com",
      color: "primary"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Live Chat",
      description: "Available 24/7 through our AI assistant",
      contact: "Chat with our AI bot",
      color: "green"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "GitHub",
      description: "Report issues and contribute",
      contact: "github.com/codebasehub",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-12">
          {/* Enhanced Hero Section */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-bold text-4xl md:text-6xl tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-orange-500 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Have questions, feedback, or need support? We'd love to hear from you. Choose your preferred way to connect with our team.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card className="border-2 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 text-primary">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Send us a message</CardTitle>
                      <CardDescription className="text-base">
                        Fill out the form below and we'll get back to you within 24 hours.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                          Full Name
                        </Label>
                        <Input 
                          id="name" 
                          placeholder="Enter your name" 
                          className="h-12 rounded-xl border-2 focus:border-primary/50" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">
                          Email Address
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          className="h-12 rounded-xl border-2 focus:border-primary/50"
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-semibold">
                        Subject
                      </Label>
                      <Input 
                        id="subject" 
                        placeholder="What's this about?" 
                        className="h-12 rounded-xl border-2 focus:border-primary/50"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold">
                        Message
                      </Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us more about your inquiry..." 
                        rows={6}
                        className="rounded-xl border-2 focus:border-primary/50"
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-orange-500 hover:from-primary/90 hover:to-orange-600 shadow-lg transition-all hover:scale-[1.02] font-semibold"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Methods - Takes 1 column */}
            <div className="space-y-6">
              <Card className="border-2 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 text-primary">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    Contact Methods
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred way to reach us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 transition-all hover:from-primary/5 hover:to-orange-500/5">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-${method.color === 'primary' ? 'primary' : method.color === 'green' ? 'green-500' : 'purple-500'}/10 to-${method.color === 'primary' ? 'primary' : method.color === 'green' ? 'green-500' : 'purple-500'}/5 text-${method.color === 'primary' ? 'primary' : method.color === 'green' ? 'green-600' : 'purple-600'} shadow-sm`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{method.title}</p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {method.description}
                        </p>
                        <p className="text-xs font-mono text-primary break-all">
                          {method.contact}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Help CTA */}
              <Card className="border-2 bg-gradient-to-r from-primary/5 via-primary/5 to-orange-500/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
                        <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">Need immediate help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Check out our documentation or try our AI chat assistant for instant support.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <a
                        href="/docs"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105"
                      >
                        📚 Browse Documentation
                      </a>
                      <a
                        href="/ai"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-orange-500 px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:from-primary/90 hover:to-orange-600 shadow-lg hover:scale-105"
                      >
                        ✨ Try AI Chat
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Info */}
              <Card className="border border-muted bg-gradient-to-r from-muted/20 to-muted/10">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Response Time</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We typically respond within 24 hours during business days
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
