import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { BillingSettings } from "@/components/settings/billing-settings";

export default async function BillingSettingsPage() {
  // Session is already validated in layout
  const { data: customerState } = await authClient.customer.state({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return <BillingSettings customerState={customerState} />;
}
