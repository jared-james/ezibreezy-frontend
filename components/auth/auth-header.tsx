// components/auth/auth-header.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthHeader() {
  return (
    <header className="relative bg-background-editorial text-foreground px-6 pt-8 md:pt-12 overflow-hidden">
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
        <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] md:text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>

          <div className="font-serif text-xl md:text-2xl font-black uppercase tracking-tighter">
            EziBreezy
          </div>
        </div>
      </div>
    </header>
  );
}
