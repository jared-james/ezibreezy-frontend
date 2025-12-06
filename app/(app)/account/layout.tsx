// app/(app)/account/layout.tsx

"use client";

import { ReactNode } from "react";

interface AccountLayoutProps {
  children: ReactNode;
}

/**
 * Account Layout
 *
 * Wraps user-level (global) settings that are not workspace-specific.
 * Examples: Profile settings, security preferences, notification settings.
 */
export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="min-h-full w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
      {/* Account-level header */}
      <div className="mb-12 border-b-4 border-double border-foreground pb-6">
        <p className="eyebrow mb-3 text-brand-primary">User Settings</p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold uppercase tracking-tight text-foreground">
          Account
        </h1>
      </div>

      {/* Settings content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
