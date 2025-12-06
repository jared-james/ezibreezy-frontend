// components/sidebar-client.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Pencil,
  Lightbulb,
  Calendar,
  BarChart3,
  Settings,
  Upload,
  Hash,
  Tag,
  LogOut,
  Users,
  Link2,
} from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "@/app/actions/auth";
import {
  useWorkspaceStore,
  OrganizationNode,
} from "@/lib/store/workspace-store";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { cn } from "@/lib/utils";
import { useWorkspacePath } from "@/lib/hooks/use-workspace-path";

const coreNavigation = [
  { name: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { name: "Calendar", href: "calendar", icon: Calendar },
  { name: "Editorial", href: "editorial", icon: Pencil },
  { name: "Ideas", href: "ideas", icon: Lightbulb },
  { name: "Analytics", href: "analytics", icon: BarChart3 },
];

const assetNavigation = [
  { name: "Media Room", href: "assets/media", icon: Upload },
  { name: "Hashtags", href: "assets/hashtags", icon: Hash },
  { name: "Labels", href: "assets/labels", icon: Tag },
];

// Props are now optional as we fetch data internally
interface SidebarClientProps {
  organizationName?: string;
  displayName?: string;
  initialStructure: OrganizationNode[];
}

function NewPostButton() {
  const router = useRouter();
  const newPostPath = useWorkspacePath("editorial");

  return (
    <Button
      variant="primary"
      className="w-full gap-2 font-serif uppercase tracking-[0.12em]"
      onClick={() => router.push(newPostPath)}
    >
      <Pencil className="w-4 h-4" />
      New Post
    </Button>
  );
}

function NavItem({
  item,
  pathname,
  className,
}: {
  item: { name: string; href: string; icon: React.ElementType };
  pathname: string | null;
  className?: string;
}) {
  const isActive =
    item.href === "dashboard"
      ? pathname?.endsWith("/dashboard")
      : pathname?.includes(`/${item.href}`);
  const Icon = item.icon;

  // Build workspace-scoped path
  const href = useWorkspacePath(item.href);

  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "flex items-center gap-3 px-3 py-2 font-serif text-sm transition-colors",
        isActive
          ? "font-bold text-[--foreground]"
          : "text-[--muted] hover:text-[--foreground] hover:bg-surface-hover",
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="mt-px">{item.name}</span>
    </Link>
  );
}

export default function SidebarClient({
  displayName,
  initialStructure,
}: SidebarClientProps) {
  const pathname = usePathname();
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  // Store hooks (WorkspaceHydrator now handles setStructure)
  const { currentOrganization } = useWorkspaceStore();

  const executeLogout = async () => {
    await logout();
  };

  return (
    <aside className="w-64 bg-[--background] border-r-2 border-[--foreground] flex flex-col">
      {/* 1. Replaced Static Header with Switcher */}
      <WorkspaceSwitcher initialStructure={initialStructure} />

      <div className="p-4 border-b-2 border-[--foreground] shrink-0">
        <NewPostButton />
      </div>

      <nav className="shrink-0 px-4 py-6 space-y-2 border-b border-[--border]">
        <p className="eyebrow px-3 pb-2 text-[--muted-foreground]">Features</p>
        {coreNavigation.map((item) => (
          <NavItem key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>

      <nav className="shrink-0 px-4 py-6 space-y-2 border-b-2 border-[--foreground]">
        <p className="eyebrow px-3 pb-2 text-[--muted-foreground]">Assets</p>
        {assetNavigation.map((item) => (
          <NavItem key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="flex-1" />

      <div className="p-4 border-t-2 border-[--foreground] shrink-0">
        <NavItem
          item={{
            name: "Channels",
            href: "settings/integrations",
            icon: Link2,
          }}
          pathname={pathname}
          className="rounded-sm"
        />

        <div className="space-y-1 pt-1">
          {isConfirmingLogout ? (
            <>
              <p className="font-serif text-xs text-center text-[--muted-foreground] px-3 pb-1">
                Are you sure?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-1 font-serif uppercase tracking-[0.12em] py-2 text-xs"
                  onClick={() => setIsConfirmingLogout(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gap-1 font-serif uppercase tracking-[0.12em] bg-[--error] hover:bg-[--error-hover] text-[--error-foreground] border-[--error] hover:border-[--error-hover] py-2 text-xs"
                  onClick={executeLogout}
                >
                  <LogOut className="w-3 h-3" />
                  Exit
                </Button>
              </div>
            </>
          ) : (
            <>
              <NavItem
                item={{
                  name: "Settings",
                  href: "settings",
                  icon: Settings,
                }}
                pathname={pathname}
                className="rounded-sm"
              />
              <button
                onClick={() => setIsConfirmingLogout(true)}
                className="flex w-full items-center gap-3 px-3 py-2 font-serif text-sm transition-colors text-[--foreground] hover:bg-surface-hover rounded-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="mt-px">Log Out</span>
              </button>
            </>
          )}
        </div>

        {/* User Info Footer */}
        <div className="flex items-center gap-3 px-3 pt-3 opacity-60 hover:opacity-100 transition-opacity">
          <Users className="w-4 h-4 text-[--muted-foreground]" />
          <div className="flex flex-col overflow-hidden">
            <p className="font-serif text-xs font-medium text-[--foreground] truncate">
              {displayName || "Editor"}
            </p>
            {currentOrganization && (
              <p className="font-mono text-[9px] uppercase tracking-wide text-[--muted-foreground] truncate">
                {currentOrganization.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t-2 border-[--foreground] shrink-0">
        <p className="font-serif text-[0.7rem] text-center uppercase tracking-[0.2em] text-[--muted-foreground]">
          EziBreezy © 2025
        </p>
      </div>
    </aside>
  );
}
