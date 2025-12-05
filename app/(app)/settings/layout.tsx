"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Link2, Briefcase, Building2 } from "lucide-react";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentOrganization } = useWorkspaceStore();

  // We check if the user is an owner or admin of the current organization
  // You can also use the helper: hasOrgRole(currentOrganization.id, 'owner', 'admin')
  const isAdmin =
    currentOrganization?.role === "owner" ||
    currentOrganization?.role === "admin";

  const settingsNav = [
    { name: "Manage Channels", href: "/settings/integrations", icon: Link2 },
    { name: "Profile", href: "/settings/profile", icon: User },
    // Only show Organization settings to admins
    ...(isAdmin
      ? [
          {
            name: "Organization",
            href: "/settings/organization",
            icon: Building2,
          },
        ]
      : []),
    { name: "Workspaces", href: "/settings/workspace", icon: Briefcase },
  ];

  return (
    <div className="min-h-full w-full max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col">
      {/* Masthead Header */}
      <div className="mb-12 border-b-4 border-double border-foreground pb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="eyebrow mb-3 text-brand-primary">Administration</p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold uppercase tracking-tight text-foreground">
              Settings
            </h1>
          </div>
        </div>
        <p className="font-serif text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
          Manage your account credentials, integration channels, and workspace
          preferences.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-0">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav className="space-y-1 sticky top-6">
            <p className="font-serif text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4 pl-3">
              Contents
            </p>
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-3
                    font-serif text-base transition-all duration-200
                    border-l-2
                    ${
                      isActive
                        ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-brand-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="mt-0.5">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Paper */}
        <main className="lg:col-span-9">
          <div className="bg-surface border border-border p-8 md:p-10 shadow-sm min-h-[500px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
