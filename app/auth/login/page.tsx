// app/auth/login/page.tsx

"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[--background] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* POSTCARD CONTAINER */}
        <div className="bg-[#f5f0e8] border-2 border-[--foreground] shadow-lg relative">
          {/* Postcard stamp area */}
          <div className="absolute top-4 right-4 w-20 h-24 flex items-center justify-center p-2">
            <Image
              src="/logo_smile.webp"
              alt="EziBreezy Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="grid md:grid-cols-2 min-h-[500px]">
            {/* LEFT SIDE - Message area */}
            <div className="p-8 md:p-10 border-r-2 border-[--foreground] flex flex-col">
              {/* Postcard header */}
              <div className="mb-6">
                <h1
                  className="font-serif text-2xl uppercase tracking-wider text-[--muted]"
                  style={{ fontWeight: 400, letterSpacing: "0.2em" }}
                >
                  Login
                </h1>
              </div>

              {/* Handwritten-style message */}
              <div className="flex-1 flex items-center">
                <div className="space-y-1">
                  <p
                    className="font-serif text-2xl md:text-3xl"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "#4a4a4a",
                    }}
                  >
                    Welcome back
                  </p>
                  <p
                    className="font-serif text-2xl md:text-3xl"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "#4a4a4a",
                    }}
                  >
                    to your content
                  </p>
                  <p
                    className="font-serif text-2xl md:text-3xl"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "#4a4a4a",
                    }}
                  >
                    headquarters
                  </p>
                </div>
              </div>

              {/* EziBreezy branding at bottom */}
              <div className="mt-auto pt-6">
                <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                  EziBreezy
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - Address/Form area */}
            <div className="p-8 md:p-10 flex flex-col">
              <form onSubmit={handleLogin} className="flex-1 flex flex-col">
                <div className="flex-1"></div>

                <div className="space-y-4">
                  {/* Address lines styling */}
                  <div className="space-y-1">
                    <div className="border-b border-[--muted] pb-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full bg-transparent border-none font-serif text-[--foreground] focus:outline-none placeholder:text-[--muted-foreground] placeholder:italic"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b border-[--muted] pb-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        className="w-full bg-transparent border-none font-serif text-[--foreground] focus:outline-none placeholder:text-[--muted-foreground] placeholder:italic"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 border border-[--error] bg-red-50 mt-4">
                    <p className="font-serif text-xs text-[--error]">{error}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button type="submit" className="btn btn-primary w-full py-3">
                    Login
                  </button>
                </div>
              </form>

              {/* Footer links */}
              <div className="mt-6 pt-6 border-t border-[--border]">
                <p className="text-center font-serif text-sm text-[--muted]">
                  New here?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-bold text-[--foreground] hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-serif text-sm text-[--muted-foreground] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
