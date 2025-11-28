// components/landing-page/landing-page-footer.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Scissors,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { signupForWaitlist } from "@/app/actions/early-access";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPageFooter() {
  const contactEmail = "support@thegridmaster.com";
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot.length > 0) {
      setIsLoading(false);
      return;
    }

    if (!email) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await signupForWaitlist({
        email,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success("Dispatched successfully.");
      } else {
        setError(result.error || "Signup failed due to an unknown error.");
        toast.error(result.error || "Signup failed.");
      }
    } catch {
      setError("A critical network error occurred during signup.");
      toast.error("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative bg-background-editorial overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-10 pt-12 text-foreground">
        <div className="mb-4 flex flex-col md:flex-row items-center justify-between border-t-2 border-foreground pt-4 text-[10px] md:text-xs font-mono uppercase tracking-wider gap-4 md:gap-0">
          <span className="text-foreground/60 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Systems Operational
          </span>

          <div className="flex items-center space-x-6">
            <Link
              href="/tools"
              className="hover:text-brand-primary transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/privacy"
              className="hover:text-brand-primary transition-colors"
            >
              Privacy Protocol
            </Link>
            <Link
              href="/terms"
              className="hover:text-brand-primary transition-colors"
            >
              Terms of Service
            </Link>

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-brand-primary transition-colors"
              >
                Help Desk
              </a>
            )}
          </div>
        </div>

        <p className="border-t-4 border-double border-foreground/20 pt-4 text-center font-serif text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-foreground">
          EziBreezy Editorial Desk · Est. 2025 · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
