// app/(app)/layout.tsx

import SidebarClient from "@/components/sidebar-client";
import { getUserAndOrganization } from "@/lib/auth";
import { AlertCircle } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    throw new Error("User context could not be loaded for authenticated user.");
  }

  // Handle Backend Down / Context Failure
  // This catches the fallback state returned by lib/auth.ts when the backend is unreachable
  if (userContext.organizationId === "error") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f4f4f0] p-4 text-center">
        <div className="max-w-md space-y-6 bg-white p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-2 border-black">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 border-2 border-black">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
              System Offline
            </h2>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
              We couldn&apos;t connect to the operational servers. This might be
              a temporary outage or a configuration issue.
            </p>
          </div>

          <div className="pt-4">
            <form action={logout}>
              <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-black bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    );
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
