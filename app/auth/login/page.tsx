// app/auth/login/page.tsx

"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MinimalHeader from "@/components/shared/minimal-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        const errorMessage = authError.message.includes(
          "Invalid login credentials"
        )
          ? "Invalid email or password"
          : authError.message.includes("Email not confirmed")
          ? "Please check your email to confirm your account"
          : "Unable to sign in. Please try again.";

        setError(errorMessage);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground">
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
          {/* THE POSTCARD CONTAINER */}
          <div className="bg-surface border border-foreground shadow-2xl relative overflow-hidden">
            <div className="grid md:grid-cols-2 min-h-[600px]">
              {/* LEFT COLUMN: "The Message" */}
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

              {/* RIGHT COLUMN: "The Address / Form" */}
              <div className="p-8 md:p-12 flex flex-col relative bg-surface-hover/30">
                {/* The Stamp Graphic */}
                <div className="absolute top-8 right-8 pointer-events-none select-none">
                  <div className="relative w-24 h-28 border-[3px] border-dotted border-foreground/20 bg-background-editorial flex items-center justify-center rotate-3 shadow-sm">
                    <Image
                      src="/logo_smile.webp"
                      alt="Stamp"
                      width={60}
                      height={60}
                      className="opacity-80 grayscale contrast-125"
                    />
                    {/* Cancellation Waves */}
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                      <div className="w-[200%] h-px bg-foreground absolute top-1/4 -left-10 rotate-[25deg]" />
                      <div className="w-[200%] h-px bg-foreground absolute top-2/4 -left-10 rotate-[25deg]" />
                      <div className="w-[200%] h-px bg-foreground absolute top-3/4 -left-10 rotate-[25deg]" />
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="flex-1 flex flex-col justify-center mt-20 md:mt-10">
                  <form
                    onSubmit={handleLogin}
                    className="space-y-8 max-w-sm w-full"
                  >
                    <div className="space-y-8">
                      <div className="group">
                        <label
                          htmlFor="email"
                          className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="editor@example.com"
                          className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="group">
                        <label
                          htmlFor="password"
                          className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 border border-red-200 bg-red-50 text-center">
                        <p className="font-serif text-sm text-red-600">
                          {error}
                        </p>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-brand-primary text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Accessing...
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
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
