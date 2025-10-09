"use client";

import { CheckCircle2, Copy, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function SuccessPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  const copyToClipboard = () => {
    if (checkoutId) {
      navigator.clipboard.writeText(checkoutId);
      toast.success(t("success.copySuccess"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Success Icon & Message */}
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-2 font-semibold text-2xl">{t("success.title")}</h1>
          <p className="text-muted-foreground">{t("success.description")}</p>
        </div>

        {/* Transaction Details Card */}
        {checkoutId && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-lg">
                {t("success.transactionDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="mb-2 text-muted-foreground text-sm">
                  {t("success.checkoutId")}
                </p>
                <div className="flex items-center justify-between">
                  <code className="break-all font-mono text-sm">
                    {checkoutId}
                  </code>
                  <Button
                    className="ml-2 h-8 w-8 p-0"
                    onClick={copyToClipboard}
                    size="sm"
                    variant="ghost"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-muted-foreground text-xs">
                {t("success.saveRecord")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <Button asChild className="w-full" size="lg">
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            {t("success.goToDashboard")}
          </Link>
        </Button>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            {t("success.needHelp")}{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/contact"
            >
              {t("success.contactSupport")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
