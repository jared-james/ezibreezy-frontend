// app/(marketing)/features/facebook-scheduler/page-intro.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PageIntro() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
      {/* LEFT COLUMN: Visual Representation (Page/Post) */}
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

          {/* UPDATED SHADOW HERE: Changed rgba(0,0,0,1) to var(--random-blue) */}
          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_var(--random-blue)]">
            <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              {/* Page Post Mockup */}
              <div className="max-w-md mx-auto w-full bg-white border border-foreground/10 shadow-sm rounded-lg overflow-hidden">
                {/* Header */}
                <div className="p-4 flex gap-3 border-b border-foreground/5">
                  <div className="w-10 h-10 bg-brand-primary/20 rounded-full" />
                  <div>
                    <div className="h-3 w-32 bg-foreground/10 rounded mb-1" />
                    <div className="h-2 w-20 bg-foreground/5 rounded" />
                  </div>
                </div>
                {/* Content */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-brand-primary border-b-[6px] border-b-transparent ml-1" />
                  </div>
                </div>
                {/* Link Preview Bar */}
                <div className="bg-gray-50 p-3 border-t border-foreground/5">
                  <div className="h-3 w-3/4 bg-foreground/10 rounded mb-2" />
                  <div className="h-2 w-1/2 bg-foreground/5 rounded" />
                </div>
              </div>

              <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                Rich Media Publishing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Editorial Copy */}
      <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
          Build a home for
          <br />
          <span className="italic font-normal">your brand.</span>
        </h2>

        <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
          <p>
            <span className="float-left text-5xl font-black mr-3 -mt-2">F</span>
            acebook is where your business lives online. It is the storefront,
            the customer service desk, and the community board all in one.
          </p>
          <p>
            The <strong>Editorial Desk</strong> ensures your Page is always
            active, always welcoming. From reels that entertain to
            location-tagged updates that drive foot traffic, we help you manage
            your presence with purpose.
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
          >
            Manage Your Page{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
