// app/(marketing)/features/technical-ledger.tsx

// components/marketing/features/technical-ledger.tsx

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LedgerItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface TechnicalLedgerProps {
  title?: string; // Default: Technical Ledger
  subtitle: string; // e.g. "Publishing Capabilities"
  items: LedgerItem[];
  className?: string;
}

export default function TechnicalLedger({
  title = "Technical\nLedger",
  subtitle,
  items,
  className,
}: TechnicalLedgerProps) {
  return (
    <section className={cn("mb-24", className)}>
      <div className="border-t-4 border-double border-foreground pt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Header Column */}
          <div className="md:col-span-3 pt-6">
            <h3 className="font-serif text-3xl font-bold leading-none mb-2 whitespace-pre-line">
              {title}
            </h3>
            <p className="font-mono text-xs text-foreground/60">{subtitle}</p>
          </div>

          {/* Items Grid */}
          <div className="md:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30"
                >
                  <item.icon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                  <div>
                    <strong className="block font-serif text-lg mb-1">
                      {item.title}
                    </strong>
                    <p className="font-serif text-sm text-foreground/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
