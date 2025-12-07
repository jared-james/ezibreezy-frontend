// components/sign-up/full-sign-up.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MinimalHeader from "@/components/shared/minimal-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { ArrowRight, Loader2, ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import posthog from "posthog-js";
import { useSearchParams } from "next/navigation";
import { getInviteDetails } from "@/app/actions/invites";
import { signup } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export default function FullSignUp() {
  const [name, setName] = useState(""); // <--- New State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Auth state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Invite Context state
  const [inviteInfo, setInviteInfo] = useState<{
    workspaceName: string;
    inviterName: string;
  } | null>(null);
  const [verifyingInvite, setVerifyingInvite] = useState(false);

  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("token");

  // Fetch invite details on mount if token exists
  useEffect(() => {
    if (!inviteToken) return;

    const fetchInviteContext = async () => {
      setVerifyingInvite(true);
      const result = await getInviteDetails(inviteToken);

      if (result.success && result.data) {
        setInviteInfo(result.data);
      }
      setVerifyingInvite(false);
    };

    fetchInviteContext();
  }, [inviteToken]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Track signup attempt
    posthog.capture("signup_attempt", {
      email: email,
      has_invite: !!inviteToken,
    });

    try {
      // Prepare form data for Server Action
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      if (inviteToken) {
        formData.append("inviteToken", inviteToken);
      }

      // Call the signup Server Action
      const result = await signup(formData);

      if (result.error) {
        setError(result.error);
        posthog.capture("auth_error_occurred", {
          error_type: "signup",
          error_message: result.error,
          email: email,
        });
      } else {
        setIsSubmitted(true);
        posthog.identify(email, {
          email: email,
          name: name,
        });
        posthog.capture("user_signed_up", {
          email: email,
          signup_method: "email_password",
          has_invite: !!inviteToken,
        });
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      if (err instanceof Error) {
        posthog.captureException(err);
      }
      posthog.capture("auth_error_occurred", {
        error_type: "signup_unexpected",
        error_message: errorMessage,
        email: email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground">
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
                {/* LEFT COLUMN: Context Aware Message */}
                <div className="p-8 md:p-12 flex flex-col relative border-b md:border-b-0 md:border-r border-dashed border-foreground/30 bg-surface">
                  <div className="mb-8">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 border border-foreground/20 px-2 py-1">
                      {inviteInfo
                        ? "Team Invitation"
                        : "New Member Registration"}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    {verifyingInvite ? (
                      /* Skeleton Loading for Invite Info */
                      <div className="space-y-4 opacity-50">
                        <div className="h-12 w-3/4 bg-foreground/10 animate-pulse" />
                        <div className="h-20 w-full bg-foreground/10 animate-pulse" />
                      </div>
                    ) : inviteInfo ? (
                      /* INVITE CONTEXT */
                      <>
                        <div className="inline-flex items-center gap-2 text-brand-primary mb-2">
                          <UserPlus className="w-5 h-5" />
                          <span className="font-mono text-xs uppercase tracking-wider">
                            Incoming Request
                          </span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
                          Join <br />
                          <span className="font-bold italic">
                            {inviteInfo.workspaceName}
                          </span>
                        </h1>
                        <p className="font-serif text-lg text-foreground/70 leading-relaxed max-w-sm">
                          <span className="font-semibold text-foreground">
                            {inviteInfo.inviterName}
                          </span>{" "}
                          has invited you to collaborate on the desk.
                        </p>
                      </>
                    ) : (
                      /* DEFAULT CONTEXT */
                      <>
                        <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
                          Join the <br />
                          <span className="font-bold italic">
                            Editorial Desk.
                          </span>
                        </h1>
                        <p className="font-serif text-lg text-foreground/70 leading-relaxed max-w-sm">
                          Stop managing your content like a spreadsheet. Start
                          curating it like a publication.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-auto pt-12">
                    <p className="font-serif text-xs font-bold uppercase tracking-[0.2em] opacity-30">
                      EziBreezy Systems · Est. 2025
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: Form */}
                <div className="p-8 md:p-12 flex flex-col relative bg-surface-hover/30 justify-center">
                  {/* CONTENT SWITCHER */}
                  <div className="max-w-sm w-full mx-auto relative min-h-[400px] flex flex-col justify-center">
                    {/* --- STATE 1: SIGNUP FORM --- */}
                    <div
                      className={cn(
                        "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
                        !isSubmitted
                          ? "opacity-100 translate-x-0 pointer-events-auto"
                          : "opacity-0 -translate-x-8 pointer-events-none"
                      )}
                    >
                      <form
                        onSubmit={handleSignUp}
                        className="space-y-8"
                      >
                      <div className="space-y-8">
                        {/* NAME INPUT */}
                        <div className="group">
                          <label
                            htmlFor="name"
                            className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ernest Hemingway"
                            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                            disabled={isLoading}
                          />
                        </div>

                        {/* EMAIL INPUT */}
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
                            placeholder="writer@example.com"
                            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                            disabled={isLoading}
                          />
                        </div>

                        {/* PASSWORD INPUT */}
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
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                            disabled={isLoading}
                          />
                          <p className="mt-1 text-[10px] text-foreground/40 font-mono text-right">
                            Min. 6 chars
                          </p>
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
                              Processing
                            </>
                          ) : (
                            <>
                              {inviteInfo
                                ? "Accept & Create"
                                : "Create Account"}
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center space-y-4">
                        <p className="font-serif text-xs text-foreground/50 italic">
                          By signing up, you agree to our Terms & Privacy.
                        </p>

                        <div className="border-t border-dashed border-foreground/20 pt-4">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                            Already have a pass?{" "}
                            <Link
                              href="/auth/login"
                              className="font-bold text-foreground border-b border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors"
                            >
                              Login Here
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* --- STATE 2: SUCCESS / DISPATCH SENT --- */}
                  <div
                    className={cn(
                      "transition-all duration-700 delay-100 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6",
                      isSubmitted
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
                        Dispatch Sent
                      </h3>
                      <p className="font-mono text-xs uppercase tracking-widest text-foreground/50">
                        Check your mailbox...
                      </p>
                    </div>

                    <div className="max-w-md space-y-3 font-serif text-sm text-foreground/70">
                      <p>
                        We have sent a confirmation link to <strong>{email}</strong>.
                      </p>
                      <p className="italic text-xs">
                        Please check your inbox (and spam folder) to validate your credentials.
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center opacity-50 pt-4">
                      {/* Fake progress indicators */}
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" />
                    </div>

                    <div className="pt-4">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 border-b-2 border-foreground/30 pb-1 font-mono text-xs uppercase tracking-widest hover:text-brand-primary hover:border-brand-primary transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Return to Front Page
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
