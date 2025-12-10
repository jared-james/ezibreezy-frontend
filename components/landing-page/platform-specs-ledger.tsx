// components/landing-page/platform-specs-ledger.tsx

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLATFORM_SPECS } from "./platform-data";
import { Check, Cpu } from "lucide-react";

export default function PlatformSpecsLedger() {
  const [activeTab, setActiveTab] = useState(PLATFORM_SPECS[0].id);

  return (
    <>
      <div className="col-span-1 md:col-span-12 bg-background-editorial p-8 md:p-12 border-t-0">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-6 h-6 text-brand-primary" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Technical Specifications
          </h2>
        </div>
        <p className="font-serif text-lg text-foreground/70 max-w-2xl">
          We don't just "support" these platforms. We engineered deep
          integrations that utilize their native features, specific APIs, and
          unique quirks.
        </p>
      </div>

      <div className="col-span-1 md:col-span-4 lg:col-span-3 bg-background-editorial border-t-0 flex flex-col">
        {PLATFORM_SPECS.map((platform) => {
          const isActive = activeTab === platform.id;
          const Icon = platform.icon;

          return (
            <button
              key={platform.id}
              onClick={() => setActiveTab(platform.id)}
              className={cn(
                "group flex items-center gap-4 p-5 text-left transition-all border-b border-foreground/10 last:border-0",
                isActive
                  ? "bg-brand-primary text-brand-primary-foreground"
                  : "hover:bg-foreground/5 text-foreground bg-background-editorial"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-foreground/70"
                )}
              />
              <span className="block font-serif font-bold text-sm tracking-wide">
                {platform.name}
              </span>
            </button>
          );
        })}
      </div>

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
              <div className="flex flex-col xl:flex-row xl:items-end justify-between border-b border-foreground/10 pb-8 mb-10 gap-6">
                <div>
                  <h3 className="font-serif text-5xl md:text-6xl font-medium mb-2 tracking-tight">
                    {platform.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-primary font-bold">
                    {platform.subtitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {platform.features.map((feature, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-5 bg-brand-primary" />
                      <h4 className="font-serif text-xl font-bold text-foreground">
                        {feature.title}
                      </h4>
                    </div>
                    <ul className="space-y-3 pl-4">
                      {feature.points.map((point, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed font-serif"
                        >
                          <Check className="w-3.5 h-3.5 text-brand-primary mt-1 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-20 pt-6 border-t border-dashed border-foreground/20 flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                  API Status: {platform.apiStatus.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
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
