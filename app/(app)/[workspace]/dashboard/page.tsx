// app/(app)/[workspace]/dashboard/page.tsx

import Image from "next/image";

// Force dynamic rendering - no caching for dashboard
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { workspace } = await params;

  return (
    <div className="w-full h-full min-h-[85vh] flex items-center justify-center bg-[--background] px-4 relative overflow-hidden">
      {/* Subtle Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main Container - FADE IN ONLY */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-in fade-in duration-1000 fill-mode-forwards">
        {/* THE ANIMATION (Matched to Login Sync state) */}
        <div className="relative w-32 h-32 mb-8">
          {/* Rotating Ring - Primary Green */}
          <div className="w-full h-full rounded-full border-2 border-dashed border-brand-primary/30 flex items-center justify-center animate-[spin_10s_linear_infinite]" />

          {/* Static Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo_smile.webp"
              alt="Logo"
              width={64}
              height={64}
              className="opacity-90 grayscale contrast-125"
            />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h1 className="font-serif text-5xl font-medium text-brand-primary tracking-tight">
            Coming Soon
          </h1>

          <p className="font-serif text-[--muted] text-lg">
            Workspace:{" "}
            <span className="font-bold text-[--foreground]">{workspace}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
