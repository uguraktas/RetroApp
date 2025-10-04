import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { GeneralSettings } from "@/components/settings/general-settings";

export default async function GeneralSettingsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  // Session is already validated in layout, safe to assert
  return <GeneralSettings user={session.data!.user} />;
}
