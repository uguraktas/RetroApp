"use client";

import { CheckCircle2, Copy, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  const copyToClipboard = () => {
    if (checkoutId) {
      navigator.clipboard.writeText(checkoutId);
      toast.success("Checkout ID copied to clipboard!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        {/* Success Icon */}
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-2 font-bold text-3xl text-gray-900 dark:text-gray-100">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>
        </div>

        {/* Checkout ID Card */}
        {checkoutId && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-lg">
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="mb-1 text-gray-500 text-sm dark:text-gray-400">
                  Checkout ID
                </p>
                <div className="flex items-center justify-between">
                  <code className="break-all font-mono text-gray-900 text-sm dark:text-gray-100">
                    {checkoutId}
                  </code>
                  <Button
                    className="ml-2 shrink-0"
                    onClick={copyToClipboard}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-gray-500 text-xs dark:text-gray-400">
                Save this ID for your records
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg" variant="outline">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Need help? Contact our{" "}
            <Link className="text-primary hover:underline" href="/contact">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
