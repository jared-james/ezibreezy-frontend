// app/(marketing)/features/feature-masthead.tsx

// components/marketing/features/feature-masthead.tsx

import { cn } from "@/lib/utils";

interface FeatureMastheadProps {
  title: string;
  headline: string;
  subheadline: string;
  className?: string;
}

export default function FeatureMasthead({
  title,
  headline,
  subheadline,
  className,
}: FeatureMastheadProps) {
  return (
    <header
      className={cn(
        "border-b-4 border-double border-foreground py-8 mb-12",
        className
      )}
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
            {title}
          </h1>
        </div>
        <div className="md:text-right max-w-md">
          <p className="font-serif text-xl md:text-2xl leading-tight">
            {headline} <br />
            <span className="text-foreground/60 italic">{subheadline}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
