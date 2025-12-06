// app/(app)/[workspace]/settings/layout.tsx

"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Link2, Briefcase, Building2 } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";

interface WorkspaceSettingsLayoutProps {
  children: ReactNode;
}

/**
 * Workspace Settings Layout
 *
 * Provides navigation sidebar for workspace-scoped settings.
 * Settings here are specific to the current workspace.
 */
export default function WorkspaceSettingsLayout({
  children,
}: WorkspaceSettingsLayoutProps) {
  const params = useParams<{ workspace: string }>();
  const pathname = usePathname();
  const { currentOrganization } = useWorkspaceStore();

  const workspace = params.workspace;

  // Check if user is admin to show organization settings
  const isAdmin =
    currentOrganization?.role === "owner" ||
    currentOrganization?.role === "admin";

  const settingsNav = [
    {
      name: "Workspace",
      href: `/${workspace}/settings`,
      icon: Briefcase,
    },
    {
      name: "Manage Channels",
      href: `/${workspace}/settings/integrations`,
      icon: Link2,
    },
    ...(isAdmin
      ? [
          {
            name: "Organization",
            href: `/${workspace}/settings/organization`,
            icon: Building2,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-full w-full max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col">
      {/* Settings Header */}
      <div className="mb-12 border-b-4 border-double border-foreground pb-6">
        <p className="eyebrow mb-3 text-brand-primary">Workspace Settings</p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold uppercase tracking-tight text-foreground">
          Settings
        </h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-0">
        {/* Settings Navigation Sidebar */}
        <aside className="lg:col-span-3">
          <nav className="space-y-1 sticky top-6">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors",
                    "border border-transparent",
                    isActive
                      ? "bg-brand-primary/10 border-brand-primary text-brand-primary font-semibold"
                      : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
