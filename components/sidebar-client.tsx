// components/sidebar-client.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const coreNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Editorial", href: "/editorial", icon: Pencil },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const assetNavigation = [
  { name: "Media Room", href: "/assets/media", icon: Upload },
  { name: "Hashtags", href: "/assets/hashtags", icon: Hash },
  { name: "Labels", href: "/assets/labels", icon: Tag },
];

interface SidebarClientProps {
  displayName: string;
  organizationName: string;
}

export default function SidebarClient({
  displayName,
  organizationName,
}: SidebarClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  const NavItem = ({
    item,
    className,
  }: {
    item: { name: string; href: string; icon: React.ElementType };
    className?: string;
  }) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === item.href
        : pathname?.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 font-serif text-sm transition-colors",
          isActive
            ? "font-bold text-[--foreground]"
            : "text-[--muted] hover:text-[--foreground] hover:bg-surface-hover",
          className
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="mt-[1px]">{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className=" justify-centerw-64 bg-[--background] border-r-2 border-[--foreground] flex flex-col">
      {/* Masthead / Organization Name (Primary Context) */}
      <div className="h-16 flex items-center px-6 border-b-2 border-[--foreground] shrink-0">
        <Link
          href="/dashboard"
          className="font-serif font-normal text-sm uppercase tracking-[0.15em] text-[--foreground] truncate"
          title={organizationName}
        >
          {organizationName}
        </Link>
      </div>

      {/* Primary CTA: New Post */}
      <div className="p-4 border-b-2 border-[--foreground] shrink-0">
        <Button
          variant="primary"
          className="w-full gap-2 font-serif uppercase tracking-[0.12em]"
          onClick={() => router.push("/editorial")}
        >
          <Pencil className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Navigation - Core Features */}
      <nav className="shrink-0 px-4 py-6 space-y-2 border-b border-[--border]">
        <p className="eyebrow px-3 pb-2 text-[--muted-foreground]">Features</p>
        {coreNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Navigation - Asset Management */}
      <nav className="shrink-0 px-4 py-6 space-y-2 border-b-2 border-[--foreground]">
        <p className="eyebrow px-3 pb-2 text-[--muted-foreground]">Assets</p>
        {assetNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      <div className="flex-1" />

      {/* User / Settings / Logout Panel */}
      <div className="p-4 border-t-2 border-[--foreground] bg-surface-hover shrink-0">
        {/* Simplified Organization Context (Visible only if single org, clickable if multi-org) */}
        {/* Placeholder for future multi-org button - currently single org display */}
        <div className="flex items-center gap-3 px-3 pb-3">
          <Users className="w-4 h-4 text-[--muted-foreground]" />
          <p className="font-serif text-xs font-medium text-[--muted-foreground] truncate">
            {organizationName}
          </p>
        </div>

        {/* Settings and Logout */}
        <div className="space-y-1 pt-1">
          <NavItem
            item={{ name: "Settings", href: "/settings", icon: Settings }}
            className="rounded-sm"
          />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 font-serif text-sm transition-colors text-error hover:bg-error/10 rounded-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="mt-[1px]">Log Out</span>
          </button>
        </div>
      </div>

      {/* Original Footer Section */}
      <div className="p-4 border-t-2 border-[--foreground] shrink-0">
        <p className="font-serif text-[0.7rem] text-center uppercase tracking-[0.2em] text-[--muted-foreground]">
          EziBreezy © 2025
        </p>
      </div>
    </aside>
  );
}
