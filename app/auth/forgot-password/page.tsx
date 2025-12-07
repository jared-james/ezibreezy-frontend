// app/auth/forgot-password/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import MinimalHeader from "@/components/shared/minimal-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await requestPasswordReset(email);
    setIsLoading(false);
    setIsSent(true);
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
                    System Recovery
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
                    Lost Your <br />
                    <span className="font-bold italic">Access Key?</span>
                  </h1>
                  <p className="font-serif text-lg text-foreground/70 leading-relaxed max-w-sm">
                    It happens to the best of us. Enter your credentials, and we
                    will dispatch a secure recovery link via courier (email).
                  </p>
                </div>

                <div className="mt-auto pt-12">
                  <Link
                    href="/auth/login"
                    className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Return to Login
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE FORM */}
              <div className="p-8 md:p-12 flex flex-col relative bg-surface-hover/30 justify-center">
                {/* DECORATIVE STAMP */}
                <div
                  className={cn(
                    "absolute top-8 right-8 pointer-events-none select-none transition-all duration-700",
                    isSent
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
                        isSent
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
                      !isSent
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-8 pointer-events-none"
                    )}
                  >
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="group">
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                          Registered Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="editor@example.com"
                          className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
                          disabled={isLoading}
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
                              Locating Record...
                            </>
                          ) : (
                            <>
                              Send Reset Link
                              <Mail className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* --- STATE 2: SUCCESS / SENT --- */}
                  <div
                    className={cn(
                      "transition-all duration-700 delay-100 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6",
                      isSent
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
                        Dispatch Confirmed
                      </h3>
                      <p className="font-serif text-sm text-foreground/70 leading-relaxed max-w-[280px] mx-auto">
                        If an account exists for{" "}
                        <span className="font-bold">{email}</span>, a secure
                        recovery link is on its way to your inbox.
                      </p>
                    </div>

                    <div className="pt-4">
                      <Link href="/auth/login">
                        <button className="text-xs font-bold uppercase tracking-widest text-brand-primary border-b border-brand-primary hover:text-brand-primary-hover hover:border-brand-primary-hover transition-colors pb-0.5">
                          Return to Login
                        </button>
                      </Link>
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
