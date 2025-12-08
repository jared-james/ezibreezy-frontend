// app/not-found.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceStructure } from "@/app/actions/workspaces";
import { FileQuestion, ArrowRight, Home } from "lucide-react";

export default async function NotFound() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let defaultWorkspacePath: string | null = null;

  if (user) {
    const workspaceResult = await getWorkspaceStructure();
    if (workspaceResult.success) {
      const nodes = workspaceResult.data || [];
      const firstWs = nodes.flatMap((n) => n.workspaces)[0];
      if (firstWs) defaultWorkspacePath = `/${firstWs.slug}/dashboard`;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-editorial px-6 py-12 text-foreground">
      {/* Background Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-lg">
        {/* The "Notice" Card */}
        <div className="relative border-2 border-dotted border-foreground/40 bg-surface p-8 md:p-12 shadow-sm">
          {/* Decorative Corner Marks */}
          <div className="absolute -left-0.5 -top-0.5 h-4 w-4 border-l-2 border-t-2 border-foreground" />
          <div className="absolute -right-0.5 -top-0.5 h-4 w-4 border-r-2 border-t-2 border-foreground" />
          <div className="absolute -bottom-0.5 -left-0.5 h-4 w-4 border-b-2 border-l-2 border-foreground" />
          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 border-b-2 border-r-2 border-foreground" />

          {/* Header / Meta Info */}
          <div className="mb-6 flex items-center justify-between border-b border-dashed border-foreground/20 pb-4">
            <div className="flex items-center gap-2 text-red-600">
              <FileQuestion className="h-4 w-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Error 404
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
              Page Missing
            </span>
          </div>

          {/* Main Content */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              This page has gone off script.
            </h1>

            <div className="space-y-4 text-lg font-serif text-foreground/80">
              <p>
                We couldn&rsquo;t find the page you were looking for. It may
                have been moved, renamed, or redacted from the record.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col gap-3">
            {user && defaultWorkspacePath ? (
              <Link href={defaultWorkspacePath} className="w-full">
                <Button
                  variant="default"
                  className="w-full justify-center gap-2 py-6 font-mono text-xs uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  Return to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : user ? (
              <Link href="/dashboard" className="w-full">
                <Button
                  variant="default"
                  className="w-full justify-center gap-2 py-6 font-mono text-xs uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  Return to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login" className="w-full">
                <Button
                  variant="default"
                  className="w-full justify-center gap-2 py-6 font-mono text-xs uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  Log in <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-foreground/20 py-6 font-mono text-xs uppercase tracking-widest hover:bg-foreground/5 hover:text-foreground"
              >
                <Home className="h-4 w-4" /> Return Home
              </Button>
            </Link>
          </div>

          {/* Footer Footnote */}
          <div className="mt-8 pt-4 text-center border-t border-dashed border-foreground/20">
            <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
              System Message // ID: NOT_FOUND
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
