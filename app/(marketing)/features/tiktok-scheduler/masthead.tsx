// app/(marketing)/features/tiktok-scheduler/masthead.tsx

import { TikTokIcon } from "@/components/landing-page/platform-icons";

export default function Masthead() {
  return (
    <header className="border-b-4 border-double border-foreground py-8 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
            TikTok
          </h1>
        </div>
        <div className="md:text-right max-w-md">
          <p className="font-serif text-xl md:text-2xl leading-tight">
            The entertainment console. <br />
            <span className="text-foreground/60 italic">
              Where creativity finds its rhythm.
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
