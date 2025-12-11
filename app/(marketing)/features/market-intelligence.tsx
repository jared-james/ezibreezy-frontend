// app/(marketing)/features/market-intelligence.tsx

// components/marketing/features/market-intelligence.tsx

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface MetricItem {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  description: string;
  customIcon?: ReactNode; // For when we need colored dots instead of an icon
}

interface MarketIntelligenceProps {
  leadTitle: ReactNode;
  leadCopy: ReactNode; // The paragraphs in the left box
  metrics: MetricItem[];
  className?: string;
}

export default function MarketIntelligence({
  leadTitle,
  leadCopy,
  metrics,
  className,
}: MarketIntelligenceProps) {
  return (
    <section className={cn("mb-24", className)}>
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-mono text-xs uppercase tracking-widest font-bold bg-foreground text-background px-2 py-1">
          Market Intelligence
        </h3>
        <div className="h-px flex-1 bg-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 border border-foreground">
        {/* Lead: The Philosophy of Data */}
        <div className="p-8 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-foreground bg-background-editorial">
          <h2 className="font-serif text-3xl font-bold leading-none mb-6">
            {leadTitle}
          </h2>
          <div className="font-serif text-lg leading-relaxed text-foreground/80 space-y-6">
            {leadCopy}
          </div>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={cn(
                "p-6 hover:bg-white transition-colors group border-foreground/20",
                // Grid border logic:
                // All items have bottom border except the last row (calculated loosely for simplicity or explicit classes)
                "border-b",
                // Right border on non-last-in-row items
                "md:border-r",
                // Remove right border on the 3rd item in a row (md screen)
                (index + 1) % 3 === 0 && "md:border-r-0",
                // Remove right border on 2nd item in a row (sm screen)
                (index + 1) % 2 === 0 && "sm:border-r-0 md:border-r",
                // Clean up bottom borders for last items
                index >= metrics.length - (metrics.length % 3 || 3) &&
                  "md:border-b-0"
              )}
            >
              <div className="mb-3">
                {metric.customIcon ? (
                  metric.customIcon
                ) : (
                  <metric.icon className="w-5 h-5 text-brand-primary" />
                )}
              </div>
              <h4 className="font-bold font-serif text-lg mb-1">
                {metric.label}
              </h4>
              <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                {metric.sublabel}
              </p>
              <p className="text-sm text-foreground/70 leading-snug">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
