import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import PlannerBoard from "./components/planner-board";
import { InfoSection } from "../instagram-carousel-splitter/components/info-section";

export default function GridPlannerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
      <LandingPageHeader />

      <main className="flex-1 py-16 px-4 md:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight uppercase">
              Visual Grid Planner
            </h1>
            <p className="font-serif text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed italic border-l-2 border-dotted border-brand-primary pl-6">
              Curate your feed before you post. Drag, drop, and organize your
              aesthetic.
              <span className="text-brand-primary text-sm not-italic font-bold block mt-2 font-mono uppercase tracking-widest">
                * Saves automatically to your device
              </span>
            </p>
          </div>

          <div className="bg-white border-2 border-double border-foreground p-1.5">
            <div className="border border-dashed border-foreground/30 min-h-[600px] flex flex-col relative bg-surface-hover/30 p-4 md:p-8">
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-foreground z-20 -translate-x-0.5 -translate-y-0.5" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-foreground z-20 translate-x-0.5 -translate-y-0.5" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-foreground z-20 -translate-x-0.5 translate-y-0.5" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-foreground z-20 translate-x-0.5 translate-y-0.5" />

              <PlannerBoard />
            </div>
          </div>

          <InfoSection />
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
