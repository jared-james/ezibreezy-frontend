// app/(marketing)/editorial/_posts/instagram-captions-2025/post.tsx

import Link from "next/link";
import { ArrowDown } from "lucide-react";

// Imports
import FunnyCaptions from "./funny";
import CuteCaptions from "./cute";
import ShortCaptions from "./short";
import SelfieCaptions from "./selfie";
import CouplesCaptions from "./couples";
import TravelCaptions from "./travel";
import StoryCaptions from "./stories";
import AestheticCaptions from "./aesthetic";
import ReelsCaptions from "./reels";
import BusinessCaptions from "./business";
import Winter2025Captions from "./winter-2025";

// The Rest
import WittyCaptions from "./witty";
import MotivationalCaptions from "./motivational";
import FoodCoffeeCaptions from "./food-coffee";
import FitnessCaptions from "./fitness";
import SassyCaptions from "./sassy";
import LyricCaptions from "./lyrics";
import BirthdayCaptions from "./birthday";
import FashionCaptions from "./fashion";
import FriendsCaptions from "./friends";
import NatureCaptions from "./nature";
import WeekendCaptions from "./weekend";

export const metadata = {
  slug: "instagram-captions-2025",
  title: "300+ Best Instagram Captions for 2025",
  excerpt:
    "The definitive collection. Funny, cute, short, and aesthetic instagram captions curated for the new year.",
  publishedAt: "2025-12-11",
};

export default function Post() {
  return (
    <>
      {/* Intro Section - Updated to EziBreezy Tone */}
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        <span className="float-left text-6xl font-black mr-3 mt-[-10px] font-serif">
          T
        </span>
        hat blinking cursor is where momentum goes to die. You’ve got the photo.
        The crop is perfect. The filter is locked in. And then you hit the
        caption box and suddenly it feels like homework.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Most of us treat the caption like admin, something we have to fill in so
        we can finally hit “Post.” But in 2025, The words make people care
        enough to stay.
      </p>

      <div className="my-12 p-6 border-l-4 border-brand-primary bg-surface-hover/50 italic font-serif text-xl">
        "You can’t outsource your taste, but you can give it words. That’s what
        a good caption really is."
      </div>

      <p className="mb-12 text-lg leading-relaxed text-foreground/80">
        We put this collection together not as a list of “growth hacks,” but as
        a way to take the pressure off the blank page. Use these lines as a
        starting point, tweak, remix, and bend them until they sound like you.
      </p>

      {/* Index / Table of Contents */}
      <div className="bg-surface/50 border border-foreground/10 p-6 mb-12 rounded-sm">
        <p className="font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
          <ArrowDown className="w-3 h-3" /> The Index
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 font-mono text-xs uppercase tracking-wider text-foreground/60">
          {/* HIGH VOLUME */}
          <Link
            href="#funny"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            01. Funny
          </Link>
          <Link
            href="#short"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            02. Short
          </Link>
          <Link
            href="#cute"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            03. Cute
          </Link>
          <Link
            href="#selfie"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            04. Selfies
          </Link>
          <Link
            href="#couples"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            05. Couples
          </Link>
          <Link
            href="#travel"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            06. Travel
          </Link>
          <Link
            href="#story"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            07. Story
          </Link>
          <Link
            href="#aesthetic"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            08. Aesthetic
          </Link>
          <Link
            href="#reels"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            09. Reels
          </Link>
          <Link
            href="#business"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            10. Business
          </Link>
          <Link
            href="#2025"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            11. 2025
          </Link>

          {/* SUPPORTING */}
          <Link
            href="#witty"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            12. Witty
          </Link>
          <Link
            href="#motivational"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            13. Motivational
          </Link>
          <Link
            href="#food-coffee"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            14. Food & Coffee
          </Link>
          <Link
            href="#fitness"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            15. Fitness
          </Link>
          <Link
            href="#sassy"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            16. Sassy
          </Link>
          <Link
            href="#lyrics"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            17. Lyrics
          </Link>
          <Link
            href="#birthday"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            18. Birthday
          </Link>
          <Link
            href="#fashion"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            19. Fashion
          </Link>
          <Link
            href="#friends"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            20. Friends
          </Link>
          <Link
            href="#nature"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            21. Nature
          </Link>
          <Link
            href="#weekend"
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            22. Weekend
          </Link>
        </div>
      </div>

      <hr className="border-t-2 border-dotted border-foreground/20 my-12" />

      {/* --- TIER 1: HIGH VOLUME (100-1K+) --- */}

      {/* 1. Funny Instagram Captions */}
      <div id="funny" className="scroll-mt-32" />
      <FunnyCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 2. Short Instagram Captions */}
      <div id="short" className="scroll-mt-32" />
      <ShortCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 3. Cute Instagram Captions */}
      <div id="cute" className="scroll-mt-32" />
      <CuteCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 4. Instagram Captions for Selfies */}
      <div id="selfie" className="scroll-mt-32" />
      <SelfieCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 5. Instagram Captions for Couples */}
      <div id="couples" className="scroll-mt-32" />
      <CouplesCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 6. Instagram Captions for Travel */}
      <div id="travel" className="scroll-mt-32" />
      <TravelCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 7. Instagram Story Captions */}
      <div id="story" className="scroll-mt-32" />
      <StoryCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* --- TIER 2: SPECIFIC INTENT --- */}

      {/* 8. Aesthetic Instagram Captions */}
      <div id="aesthetic" className="scroll-mt-32" />
      <AestheticCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 9. Instagram Reel Captions */}
      <div id="reels" className="scroll-mt-32" />
      <ReelsCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 10. Instagram Captions for Business */}
      <div id="business" className="scroll-mt-32" />
      <BusinessCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* 11. Best Instagram Captions 2025 */}
      <div id="2025" className="scroll-mt-32" />
      <Winter2025Captions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      {/* --- TIER 3: THE LONG TAIL (Bonus Content) --- */}

      <div id="witty" className="scroll-mt-32" />
      <WittyCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="motivational" className="scroll-mt-32" />
      <MotivationalCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="food-coffee" className="scroll-mt-32" />
      <FoodCoffeeCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="fitness" className="scroll-mt-32" />
      <FitnessCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="sassy" className="scroll-mt-32" />
      <SassyCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="lyrics" className="scroll-mt-32" />
      <LyricCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="birthday" className="scroll-mt-32" />
      <BirthdayCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="fashion" className="scroll-mt-32" />
      <FashionCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="friends" className="scroll-mt-32" />
      <FriendsCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="nature" className="scroll-mt-32" />
      <NatureCaptions />
      <hr className="border-t border-dashed border-foreground/10 my-8" />

      <div id="weekend" className="scroll-mt-32" />
      <WeekendCaptions />

      {/* Footer / CTA specific to this article */}
      <div className="mt-16 p-8 bg-brand-primary/10 border border-brand-primary/20 rounded-sm text-center">
        <h3 className="font-serif text-2xl font-bold mb-4">
          Never type a caption manually again.
        </h3>
        <p className="mb-6 text-foreground/70 max-w-md mx-auto">
          The EziBreezy Editorial Desk lets you drag, drop, and schedule your
          captions alongside your visuals.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block bg-brand-primary text-background px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-colors"
        >
          Try it Free
        </Link>
      </div>
    </>
  );
}
