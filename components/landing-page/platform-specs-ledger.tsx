// components/landing-page/platform-specs-ledger.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PLATFORM_SPECS } from "./platform-data";
import { Check, Cpu } from "lucide-react";

export default function PlatformSpecsLedger() {
  const [activeTab, setActiveTab] = useState(PLATFORM_SPECS[0].id);

  // Consistent 1950s styling variables
  const borderStyle = "border-foreground/20";
  const dashedBorder = "border-foreground/30 border-dashed";

  // Map platform IDs to their scheduler pages for SEO-friendly links
  const platformLinks: Record<string, string> = {
    instagram: "/features/instagram-scheduler",
    facebook: "/features/facebook-scheduler",
    threads: "/features/threads-scheduler",
    tiktok: "/features/tiktok-scheduler",
    linkedin: "/features/linkedin-scheduler",
    youtube: "/features/youtube-scheduler",
    x: "/features/twitter-scheduler",
    pinterest: "/features/pinterest-scheduler",
  };

  return (
    <>
      {/* 
        HEADER SECTION 
      */}
      <div
        className={`col-span-1 md:col-span-12 bg-background-editorial p-8 md:p-12 border-t ${dashedBorder}`}
      >
        <div className="flex items-center gap-3 mb-4">
          {/* UPDATED FONT: Lighter weight, tighter tracking, specific leading */}
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 leading-[0.95] tracking-tight">
            Platform Specifications
          </h2>
        </div>
      </div>

      {/* 
        NAVIGATION SIDEBAR 
      */}
      <div
        className={`col-span-1 md:col-span-4 lg:col-span-3 bg-background-editorial border-t-0 border-b md:border-b-0 md:border-r ${borderStyle} flex flex-row md:flex-col overflow-x-auto md:overflow-visible no-scrollbar`}
      >
        {PLATFORM_SPECS.map((platform) => {
          const isActive = activeTab === platform.id;
          const Icon = platform.icon;

          return (
            <Link
              key={platform.id}
              href={platformLinks[platform.id]}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(platform.id);
              }}
              className={cn(
                "group flex items-center justify-center md:justify-start gap-4 transition-all shrink-0",
                // Mobile Sizing
                "h-16 w-16 md:h-auto md:w-auto md:p-5",
                // Borders
                `border-r ${borderStyle} md:border-r-0`,
                `md:border-b ${borderStyle} md:last:border-b-0`,
                isActive
                  ? "bg-brand-primary text-brand-primary-foreground"
                  : "hover:bg-foreground/5 text-foreground bg-background-editorial"
              )}
              title={platform.name}
            >
              <Icon
                className={cn(
                  "transition-transform group-hover:scale-110",
                  "w-6 h-6 md:w-5 md:h-5",
                  isActive ? "text-white" : "text-foreground/70"
                )}
              />
              {/* UPDATED FONT: Changed font-bold to font-medium for lighter look */}
              <span className="hidden md:block font-serif font-medium text-sm tracking-wide">
                {platform.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 
        CONTENT PANEL 
      */}
      <div className="col-span-1 md:col-span-8 lg:col-span-9 bg-background-editorial relative min-h-[600px]">
        {PLATFORM_SPECS.map((platform) => {
          const isActive = activeTab === platform.id;

          return (
            <div
              key={platform.id}
              className={cn(
                "absolute inset-0 p-8 md:p-12 overflow-y-auto custom-scrollbar transition-opacity duration-300",
                isActive
                  ? "opacity-100 z-10 static"
                  : "opacity-0 z-0 hidden absolute"
              )}
              role="tabpanel"
              aria-hidden={!isActive}
            >
              {/* Title Section */}
              <div
                className={`flex flex-col xl:flex-row xl:items-end justify-between border-b ${dashedBorder} pb-8 mb-10 gap-6`}
              >
                <div>
                  <h3 className="font-serif text-5xl md:text-6xl font-medium mb-2 tracking-tight">
                    {platform.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-primary font-bold">
                    {platform.subtitle}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {platform.features.map((feature, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-px h-5 bg-brand-primary" />
                      {/* UPDATED FONT: Changed font-bold to font-medium */}
                      <h4 className="font-serif text-xl font-medium text-foreground">
                        {feature.title}
                      </h4>
                    </div>
                    <ul className="space-y-3 pl-4">
                      {feature.points.map((point, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed font-serif"
                        >
                          <Check className="w-3.5 h-3.5 text-brand-primary mt-1 shrink-0 opacity-70" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className={`mt-20 pt-6 border-t ${dashedBorder} flex justify-between items-center opacity-70`}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">
                  API Status: {platform.apiStatus.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">
                  {platform.uniqueCapability.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
