// components/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pencil,
  Lightbulb,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Editorial", href: "/editorial", icon: Pencil },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[--background] border-r-2 border-[--foreground] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b-2 border-[--foreground]">
        <Link
          href="/dashboard"
          className="font-serif font-normal text-lg uppercase tracking-[0.15em] text-[--foreground]"
        >
          Breezy Times
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2
                font-serif text-sm transition-colors
                ${
                  isActive
                    ? "font-bold text-[--foreground]"
                    : "text-[--muted] hover:text-[--foreground]"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="mt-[1px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-[--foreground]">
        <p className="font-serif text-[0.7rem] text-center uppercase tracking-[0.2em] text-[--muted-foreground]">
          EziBreezy © 2025
        </p>
      </div>
    </aside>
  );
}
