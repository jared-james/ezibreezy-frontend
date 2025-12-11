// app/(marketing)/features/twitter-scheduler/final-cta.tsx

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <div className="relative py-20 px-6 text-center overflow-hidden border-t-2 border-foreground">
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <Sparkles className="w-8 h-8 text-brand-primary" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
          Make your statement.
        </h2>
        <p className="font-serif text-lg text-foreground/70 mb-10">
          The editorial desk is open. Schedule your threads and join the
          public discourse.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block bg-foreground text-background px-10 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-primary hover:text-white transition-all duration-300"
        >
          Get Early Access
        </Link>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-foreground/40">
          Limited Availability • Editorial Standards Applied
        </p>
      </div>
    </div>
  );
}
