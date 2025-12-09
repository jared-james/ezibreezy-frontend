// components/shared/minimal-header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MinimalHeader() {
  const pathname = usePathname();

  return (
    <header className="relative bg-background-editorial text-foreground px-4 pt-8 md:px-6 md:pt-12 overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between border-b-2 border-foreground pb-2 text-[10px] font-mono uppercase tracking-widest md:text-xs">
          {/* LEFT SIDE - Status */}
          <span className="hidden text-foreground/60 sm:block"></span>

          {/* RIGHT SIDE - Navigation links */}
          <div className="flex w-full items-center justify-end gap-4 sm:w-auto md:gap-6">
            <Link
              href="/"
              className={`px-2 py-0.5 transition-colors ${
                pathname === "/"
                  ? "bg-foreground text-background-editorial"
                  : "hover:bg-foreground hover:text-background-editorial"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tools"
              className={`px-2 py-0.5 transition-colors ${
                pathname.startsWith("/tools")
                  ? "bg-foreground text-background-editorial"
                  : "hover:bg-foreground hover:text-background-editorial"
              }`}
            >
              Tools
            </Link>
            <Link
              href="/auth/login"
              className={`px-2 py-0.5 transition-colors ${
                pathname === "/auth/login"
                  ? "bg-foreground text-background-editorial"
                  : "hover:bg-foreground hover:text-background-editorial"
              }`}
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className={`whitespace-nowrap font-bold ${
                pathname === "/auth/signup"
                  ? "underline decoration-2 underline-offset-4 text-foreground"
                  : "underline decoration-2 underline-offset-4 hover:text-foreground/70"
              }`}
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
