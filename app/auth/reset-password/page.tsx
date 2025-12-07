// app/auth/reset-password/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword, getUserContext } from "@/app/actions/user";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import MinimalHeader from "@/components/shared/minimal-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // 1. Update the password
    const result = await updatePassword(password);

    if (result.success) {
      setIsSuccess(true);
      toast.success("Password updated successfully");

      // 2. Determine where to send them
      // We fetch the user context to find their default workspace slug
      let destination = "/onboarding"; // Safe fallback

      try {
        const context = await getUserContext();
        if (context.success && context.data) {
          const slug =
            context.data.defaultWorkspaceSlug ||
            context.data.defaultWorkspaceId;
          if (slug) {
            destination = `/${slug}/dashboard`;
          }
        }
      } catch (error) {
        console.error("Failed to resolve workspace redirect", error);
      }

      // 3. Redirect after animation
      setTimeout(() => {
        router.push(destination);
      }, 2000);
    } else {
      toast.error(result.error || "Failed to update password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground transition-colors duration-500">
      <MinimalHeader />

      <main className="grow flex items-center justify-center py-16 px-4 relative">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="w-full max-w-5xl relative z-10">
          <div className="bg-surface border border-foreground shadow-2xl relative overflow-hidden transition-all duration-500">
            <div className="grid md:grid-cols-2 min-h-[500px]">
              {/* LEFT COLUMN: BRANDING & CONTEXT */}
              <div className="p-8 md:p-12 flex flex-col relative border-b md:border-b-0 md:border-r border-dashed border-foreground/30 bg-surface">
                <div className="mb-8">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 border border-foreground/20 px-2 py-1">
                    Security Protocol
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
                    Establish New <br />
                    <span className="font-bold italic">Credentials.</span>
                  </h1>
                  <p className="font-serif text-lg text-foreground/70 leading-relaxed max-w-sm">
                    You have successfully verified your identity. Please create
                    a new secure password to regain system access.
                  </p>
                </div>

                <div className="mt-auto pt-12">
                  <p className="font-serif text-xs font-bold uppercase tracking-[0.2em] opacity-30">
                    Secure Session Active
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE FORM */}
              <div className="p-8 md:p-12 flex flex-col relative bg-surface-hover/30 justify-center">
                {/* DECORATIVE STAMP */}
                <div
                  className={cn(
                    "absolute top-8 right-8 pointer-events-none select-none transition-all duration-700",
                    isSuccess
                      ? "scale-125 opacity-100 rotate-12"
                      : "opacity-80 rotate-3"
                  )}
                >
                  <div className="relative w-24 h-28 border-[3px] border-dotted border-foreground/20 bg-background-editorial flex items-center justify-center shadow-sm">
                    <Image
                      src="/logo_smile.webp"
                      alt="Stamp"
                      width={60}
                      height={60}
                      className="grayscale contrast-125"
                    />
                    {/* Green overlay on success */}
                    <div
                      className={cn(
                        "absolute inset-0 transition-colors duration-500",
                        isSuccess
                          ? "bg-green-500/10 mix-blend-multiply"
                          : "bg-transparent"
                      )}
                    />
                  </div>
                </div>

                {/* CONTENT SWITCHER */}
                <div className="max-w-sm w-full mx-auto relative min-h-[250px] flex flex-col justify-center">
                  {/* --- STATE 1: FORM --- */}
                  <div
                    className={cn(
                      "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
                      !isSuccess
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-8 pointer-events-none"
                    )}
                  >
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="group">
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
                          disabled={isLoading}
                          minLength={6}
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full bg-brand-primary text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              Update Credentials
                              <KeyRound className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* --- STATE 2: SUCCESS / REDIRECTING --- */}
                  <div
                    className={cn(
                      "transition-all duration-700 delay-100 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6",
                      isSuccess
                        ? "opacity-100 translate-x-0 transform scale-100"
                        : "opacity-0 translate-x-8 transform scale-95 pointer-events-none"
                    )}
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-foreground/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        {/* Decorative outer ring */}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600 animate-in zoom-in duration-300" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-foreground font-medium">
                        Access Restored
                      </h3>
                      <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 animate-pulse">
                        Redirecting to Workspace...
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center opacity-50 pt-4">
                      {/* Fake progress indicators */}
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
