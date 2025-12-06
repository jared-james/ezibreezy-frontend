// app/auth/login/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import MinimalHeader from "@/components/shared/minimal-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import posthog from "posthog-js";
import { syncUser } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import { login } from "@/app/actions/auth";

// Define the stages of login for better UX feedback
type LoginState = "idle" | "authenticating" | "syncing" | "redirecting";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [loginState, setLoginState] = useState<LoginState>("idle");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        auth_callback_failed:
          "Authentication failed. Please try signing in again.",
        email_not_verified: "Please verify your email address.",
        sync_failed: "Account setup failed. Please contact support.",
      };
      setError(
        errorMessages[errorParam] || "An error occurred during sign in."
      );
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginState("authenticating");

    try {
      // --- PHASE 1: Server-Side Auth (NEW) ---
      // We create a FormData object to pass to the server action
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const loginResult = await login(formData);

      if (!loginResult.success) {
        setError(loginResult.error || "Authentication failed");
        setLoginState("idle");
        return;
      }

      // --- PHASE 2: UI Success Transition ---
      setLoginState("syncing");

      // Tracking (Client-side is fine for this)
      if (loginResult.user?.email) {
        posthog.identify(loginResult.user.email, {
          email: loginResult.user.email,
        });
        posthog.capture("user_logged_in", {
          email: loginResult.user.email,
          login_method: "email_password",
        });
      }

      // --- PHASE 3: Backend Sync (Existing Server Action) ---
      // This is already secure because it runs on the server!
      const syncResult = await syncUser();

      if (!syncResult.success) {
        setError(syncResult.error || "Failed to setup workspace");
        setLoginState("idle");
        return;
      }

      // --- PHASE 4: Redirect ---
      setLoginState("redirecting");

      // Handle onboarding_required - redirect to onboarding
      if (syncResult.event === "onboarding_required") {
        router.push("/onboarding");
        return;
      }

      // Handle normal login or invite_accepted
      const targetSlug =
        syncResult.targetWorkspaceSlug || syncResult.targetWorkspaceId;
      const targetPath = targetSlug ? `/${targetSlug}/dashboard` : "/dashboard";

      router.prefetch(targetPath);

      if (syncResult.event === "invite_accepted") {
        router.push(`${targetPath}?invite=success`);
      } else {
        router.push(targetPath);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoginState("idle");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground transition-colors duration-500">
      <MinimalHeader />

      <main className="grow flex items-center justify-center py-16 px-4 relative">
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
            <div className="grid md:grid-cols-2 min-h-[600px]">
              {/* LEFT COLUMN: BRANDING */}
              <div className="p-8 md:p-12 flex flex-col relative border-b md:border-b-0 md:border-r border-dashed border-foreground/30 bg-surface">
                <div className="mb-8">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 border border-foreground/20 px-2 py-1">
                    System Access
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
                    Welcome <br />
                    <span className="font-bold italic">Back, Editor.</span>
                  </h1>
                  <p className="font-serif text-lg text-foreground/70 leading-relaxed max-w-sm">
                    Your desk is ready. The printing press is warm. Let&rsquo;s
                    get to work.
                  </p>
                </div>

                <div className="mt-auto pt-12">
                  <p className="font-serif text-xs font-bold uppercase tracking-[0.2em] opacity-30">
                    EziBreezy Systems · Est. 2025
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE AREA */}
              <div className="p-8 md:p-12 flex flex-col relative bg-surface-hover/30 justify-center">
                {/* DECORATIVE STAMP */}
                <div
                  className={cn(
                    "absolute top-8 right-8 pointer-events-none select-none transition-all duration-700",
                    loginState === "syncing" || loginState === "redirecting"
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
                        loginState === "syncing" || loginState === "redirecting"
                          ? "bg-green-500/10 mix-blend-multiply"
                          : "bg-transparent"
                      )}
                    />
                  </div>
                </div>

                {/* CONTENT SWITCHER */}
                <div className="max-w-sm w-full mx-auto relative min-h-[300px] flex flex-col justify-center">
                  {/* --- STATE 1: LOGIN FORM --- */}
                  <div
                    className={cn(
                      "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
                      loginState === "idle" || loginState === "authenticating"
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-8 pointer-events-none"
                    )}
                  >
                    <form onSubmit={handleLogin} className="space-y-8">
                      <div className="space-y-8">
                        <div className="group">
                          <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="editor@example.com"
                            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                            disabled={loginState !== "idle"}
                          />
                        </div>

                        <div className="group">
                          <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                            disabled={loginState !== "idle"}
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 border border-red-200 bg-red-50 text-center animate-in fade-in slide-in-from-top-2">
                          <p className="font-serif text-sm text-red-600">
                            {error}
                          </p>
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full bg-brand-primary text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={loginState !== "idle"}
                        >
                          {loginState === "authenticating" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Enter System
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center space-y-4">
                        <div className="border-t border-dashed border-foreground/20 pt-4">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                            Need a pass?{" "}
                            <Link
                              href="/auth/signup"
                              className="font-bold text-foreground border-b border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors"
                            >
                              Create Account
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* --- STATE 2: SUCCESS / SYNCING --- */}
                  <div
                    className={cn(
                      "transition-all duration-700 delay-100 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6",
                      loginState === "syncing" || loginState === "redirecting"
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
                        Access Granted
                      </h3>
                      <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 animate-pulse">
                        {loginState === "syncing"
                          ? "Retrieving Workspace..."
                          : "Redirecting..."}
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

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
