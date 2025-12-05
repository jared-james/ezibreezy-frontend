import { getUserAndOrganization } from "@/lib/auth";
import { IntegrationsSettings } from "@/components/settings/integrations";
import { redirect } from "next/navigation";

export default async function IntegrationsPage() {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    redirect("/auth/login");
  }

  return <IntegrationsSettings />;
}
