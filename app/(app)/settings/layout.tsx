// app/(app)/settings/layout.tsx
// Settings layout with sidebar navigation

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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex gap-8">
        {/* Settings sidebar */}
        <aside className="w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow border border-gray-200 p-2">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings content */}
        <main className="flex-1 bg-white rounded-xl shadow border border-gray-200 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
