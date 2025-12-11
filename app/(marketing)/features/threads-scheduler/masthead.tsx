// app/(marketing)/features/threads-scheduler/masthead.tsx

import { ThreadsIcon } from "@/components/landing-page/platform-icons";

export default function Masthead() {
  return (
    <header className="border-b-4 border-double border-foreground py-8 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
              Platform Specification: 07
            </span>
            <ThreadsIcon className="w-5 h-5 text-brand-primary" />
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
            Threads
          </h1>
        </div>
        <div className="md:text-right max-w-md">
          <p className="font-serif text-xl md:text-2xl leading-tight">
            The modern salon. <br />
            <span className="text-foreground/60 italic">
              Where dialogue flows without friction.
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
