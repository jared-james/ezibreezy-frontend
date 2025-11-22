"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, PenTool, Link2, Bell, CreditCard } from "lucide-react";

const settingsNav = [
  { name: "Profile", href: "/settings/profile", icon: User },
  { name: "Writing Style", href: "/settings/writing-style", icon: PenTool },
  { name: "Integrations", href: "/settings/integrations", icon: Link2 },
  { name: "Notifications", href: "/settings/notifications", icon: Bell },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col w-full max-w-7xl mx-auto">
      <div className="mb-8 border-b-4 border-double border-[--foreground] pb-6">
        <p className="eyebrow mb-2">Administration</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
          Settings
        </h1>
        <p className="font-serif text-[--muted] mt-2 max-w-xl text-lg italic">
          Manage your account, connections, and application preferences.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        <aside className="lg:col-span-3">
          <nav className="border border-[--border] bg-[--surface] p-2 space-y-1">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2
                    font-serif text-sm transition-colors
                    ${
                      isActive
                        ? "font-bold bg-surface-hover text-[--foreground]"
                        : "text-[--muted] hover:text-[--foreground] hover:bg-surface-hover"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="mt-px">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="lg:col-span-9 border border-[--border] bg-[--surface] p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
