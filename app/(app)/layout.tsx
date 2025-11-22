import SidebarClient from "@/components/sidebar-client";
import { getUserAndOrganization } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    throw new Error("User context could not be loaded for authenticated user.");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarClient
        displayName={userContext.displayName}
        organizationName={userContext.organizationName}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
