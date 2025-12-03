// components/analytics/components/analytics-tabs.tsx

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Instagram, Youtube } from "lucide-react";

export default function AnalyticsTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to preserve existing query params (like 'days') when switching tabs
  const createQueryString = () => {
    const params = new URLSearchParams(searchParams.toString());
    return params.toString() ? `?${params.toString()}` : "";
  };

  const tabs = [
    {
      name: "Headquarters",
      href: `/analytics${createQueryString()}`,
      // Active if exactly /analytics or /analytics/ (root of analytics)
      isActive: pathname === "/analytics",
      icon: LayoutDashboard,
    },
    {
      name: "Instagram",
      href: `/analytics/instagram${createQueryString()}`,
      isActive: pathname.includes("/analytics/instagram"),
      icon: Instagram,
    },
    {
      name: "YouTube",
      href: `/analytics/youtube${createQueryString()}`,
      isActive: pathname.includes("/analytics/youtube"),
      icon: Youtube,
    },
  ];

  return (
    <nav className="flex items-center gap-1 border-b border-border mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={cn(
            "group flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wide border-b-[3px] transition-all whitespace-nowrap",
            tab.isActive
              ? "border-brand-primary text-foreground bg-surface/50"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20"
          )}
        >
          <tab.icon
            className={cn(
              "h-4 w-4 transition-colors",
              tab.isActive
                ? "text-brand-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          <span>{tab.name}</span>
        </Link>
      ))}
    </nav>
  );
}
