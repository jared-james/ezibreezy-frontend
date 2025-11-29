// app/(marketing)/tools/instagram-font-generator/page.tsx

"use client";

import { useState, useEffect } from "react";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { SoftwareApplicationJsonLd } from "@/components/seo/json-ld";
import { Star, Copy, RefreshCw, Smartphone, Check, Type } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const MAPS: Record<string, string> = {
  sans_bold: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  sans_italic: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789",
  sans_bold_italic:
    "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕0123456789",
  serif_bold: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  serif_italic:
    "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍0123456789",
  script: "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789",
  script_bold: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  monospace: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
  double_struck:
    "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
  small_caps: "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789",
  bubble: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨",
};

const STYLES = [
  { id: "sans_bold", label: "Bold (Sans)" },
  { id: "serif_bold", label: "Bold (Serif)" },
  { id: "sans_italic", label: "Italic (Sans)" },
  { id: "serif_italic", label: "Italic (Serif)" },
  { id: "script", label: "Script (Cursive)" },
  { id: "script_bold", label: "Bold Script" },
  { id: "small_caps", label: "Small Caps" },
  { id: "monospace", label: "Monospace" },
  { id: "double_struck", label: "Outline" },
  { id: "bubble", label: "Bubble" },
];

function convertText(text: string, styleId: string): string {
  const map = MAPS[styleId];
  if (!map) return text;
  return text
    .split("")
    .map((char) => {
      const index = ALPHABET.indexOf(char);
      if (index === -1) return char;
      return [...map][index] || char;
    })
    .join("");
}

export default function InstagramFontGeneratorPage() {
  const [inputText, setInputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("sans_bold");
  const [previewText, setPreviewText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update preview when input or style changes
  useEffect(() => {
    const textToConvert = inputText || "Your Name";
    setPreviewText(convertText(textToConvert, selectedStyle));
  }, [inputText, selectedStyle]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setInputText("");
    setSelectedStyle("sans_bold");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
      <SoftwareApplicationJsonLd
        name="Instagram Font Generator"
        description="Free tool to generate aesthetic fonts for Instagram bios and captions. Copy and paste bold, italic, and script text."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-font-generator"
        rating={{ ratingValue: 4.8, ratingCount: 850 }}
        price="0.00"
      />

      <LandingPageHeader />

      <main className="flex-1 py-16 px-4 md:px-8 relative overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 border border-dashed border-foreground/40 bg-white/50 px-3 py-1">
              <Star className="h-4 w-4 fill-current text-brand-primary" />
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-foreground">
                Free SEO Tool
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight uppercase">
              Instagram Font Generator
            </h1>
            <p className="font-serif text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed italic border-l-2 border-dotted border-brand-primary pl-6">
              Style your Bio. Stand out in comments. Generate aesthetic
              typography to copy & paste into Instagram.
            </p>
          </div>

          {/* MAIN TOOL INTERFACE */}
          <div className="bg-white border-2 border-double border-foreground p-1.5">
            <div className="border border-dashed border-foreground/30 min-h-[600px] flex flex-col xl:flex-row relative bg-surface-hover/30">
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-foreground z-20 -translate-x-0.5 -translate-y-0.5" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-foreground z-20 translate-x-0.5 -translate-y-0.5" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-foreground z-20 -translate-x-0.5 translate-y-0.5" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-foreground z-20 translate-x-0.5 translate-y-0.5" />

              {/* LEFT COLUMN: Input & List */}
              <div className="w-full xl:w-1/2 p-6 md:p-8 flex flex-col gap-8 border-b xl:border-b-0 xl:border-r border-dashed border-foreground/30 bg-background-editorial">
                {/* Input Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-foreground/50">
                    <label className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <Type className="w-3 h-3" />
                      Type your text
                    </label>
                    <button
                      onClick={handleReset}
                      className="text-xs hover:text-brand-primary flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Bio, Name, or Caption..."
                    className="w-full h-32 p-4 bg-white border-2 border-dashed border-foreground/30 focus:border-brand-primary focus:outline-none font-serif text-xl leading-tight resize-none transition-colors"
                  />
                </div>

                {/* Font List */}
                <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                    Click to Copy
                  </label>

                  <div className="grid gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[400px]">
                    {STYLES.map((style) => {
                      const converted = inputText
                        ? convertText(inputText, style.id)
                        : style.label;
                      const isActive = selectedStyle === style.id;

                      return (
                        <div
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            // Optional: auto copy on select? No, usually separate action.
                          }}
                          className={cn(
                            "group relative flex items-center justify-between p-4 border cursor-pointer transition-all duration-200",
                            isActive
                              ? "bg-brand-primary/5 border-brand-primary shadow-sm"
                              : "bg-white border-foreground/10 hover:border-foreground/30 hover:bg-surface-hover"
                          )}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary" />
                          )}

                          <div className="flex flex-col gap-1 min-w-0 pr-4">
                            <span className="text-sm font-medium truncate font-sans text-foreground">
                              {converted}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
                              {style.label}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(
                                convertText(inputText || style.label, style.id),
                                style.id
                              );
                            }}
                            className={cn(
                              "p-2 rounded hover:bg-foreground/10 transition-colors shrink-0",
                              isActive
                                ? "text-brand-primary"
                                : "text-foreground/40"
                            )}
                            title="Copy"
                          >
                            {copiedId === style.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Mobile Preview */}
              <div className="w-full xl:w-1/2 bg-surface-hover/10 p-8 flex items-center justify-center">
                {/* Phone Simulator */}
                <div className="relative w-[320px] bg-white rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                  {/* Status Bar */}
                  <div className="h-8 bg-white flex justify-between items-center px-6 pt-2 select-none">
                    <span className="text-[10px] font-bold text-black">
                      9:41
                    </span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-black rounded-full opacity-20" />
                      <div className="w-3 h-3 bg-black rounded-full opacity-20" />
                    </div>
                  </div>

                  {/* Instagram Profile Header */}
                  <div className="px-4 pt-2 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-sm">your_username</span>
                      <div className="flex gap-4">
                        <div className="w-5 h-5 border-2 border-black rounded-md" />
                        <div className="w-5 h-5 border-2 border-black rounded-full" />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white p-[2px]">
                          <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center">
                            <span className="text-xl">😎</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex justify-between px-2 text-center">
                        <div>
                          <div className="font-bold text-sm">124</div>
                          <div className="text-[10px]">Posts</div>
                        </div>
                        <div>
                          <div className="font-bold text-sm">24K</div>
                          <div className="text-[10px]">Followers</div>
                        </div>
                        <div>
                          <div className="font-bold text-sm">420</div>
                          <div className="text-[10px]">Following</div>
                        </div>
                      </div>
                    </div>

                    {/* BIO SECTION - The Live Preview */}
                    <div className="text-xs leading-relaxed space-y-1">
                      {/* Name Field */}
                      <div className="font-bold">
                        {inputText ? previewText : "Your Name"}
                      </div>

                      {/* Category */}
                      <div className="text-gray-500">Digital Creator</div>

                      {/* Bio Body */}
                      <div className="whitespace-pre-wrap">
                        {inputText ? (
                          <>
                            Using EziBreezy to optimize my feed.
                            <br />
                            This font is{" "}
                            <strong>
                              {
                                STYLES.find((s) => s.id === selectedStyle)
                                  ?.label
                              }
                            </strong>
                            .
                          </>
                        ) : (
                          "Helping creators build better content systems.\nFounder @EziBreezy ⚡️\n👇 Get the free tool"
                        )}
                      </div>

                      {/* Link */}
                      <div className="text-blue-900 font-medium">
                        ezibreezy.com/tools
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 bg-zinc-100 py-1.5 rounded text-xs font-bold text-center">
                        Edit Profile
                      </div>
                      <div className="flex-1 bg-zinc-100 py-1.5 rounded text-xs font-bold text-center">
                        Share Profile
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex gap-4 px-4 py-3 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-14 h-14 rounded-full border border-gray-200 bg-zinc-50" />
                        <div className="w-10 h-2 bg-zinc-100 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Grid Tabs */}
                  <div className="flex border-t border-gray-100 mt-1">
                    <div className="flex-1 py-2 border-b border-black flex justify-center">
                      <div className="w-4 h-4 bg-black" />
                    </div>
                    <div className="flex-1 py-2 flex justify-center">
                      <div className="w-4 h-4 border border-black" />
                    </div>
                    <div className="flex-1 py-2 flex justify-center">
                      <div className="w-4 h-4 border border-black rounded-full" />
                    </div>
                  </div>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-3 gap-0.5 bg-white">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-zinc-100 hover:bg-zinc-200 transition-colors"
                      />
                    ))}
                  </div>

                  {/* Home Bar */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full z-10" />
                </div>

                <div className="absolute bottom-8 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                    <Smartphone className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Live Bio Preview
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="grid md:grid-cols-12 gap-12 pt-16 border-t-4 border-double border-foreground">
            <div className="md:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 bg-foreground text-background-editorial px-3 py-1">
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  Growth Guide
                </span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                Optimize your Instagram Bio.
              </h2>

              <div className="space-y-6 text-lg font-serif leading-relaxed text-foreground/80">
                <p>
                  Your Instagram bio is prime real estate. You only have a few
                  seconds to convert a visitor into a follower. Standard text
                  often blends in, making it hard to highlight your key value
                  proposition.
                </p>
                <p>
                  By strategically using <strong>bold</strong> or{" "}
                  <em>italic</em> Unicode characters, you can create visual
                  hierarchy within your bio.
                </p>

                <h3 className="font-bold text-xl mt-6 border-b border-dashed border-foreground/30 pb-2">
                  Best Practices
                </h3>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                    <span>
                      <strong>Highlight Keywords:</strong> Use bold font for
                      your title or niche (e.g., <strong>Photographer</strong>)
                      to make it skimmable.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                    <span>
                      <strong>Keep it Readable:</strong> Script fonts look great
                      but can be hard to read. Use them for your name, but keep
                      important links in standard or serif fonts.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                    <span>
                      <strong>Accessibility:</strong> Screen readers may skip
                      these characters. Don&apos;t put critical information
                      solely in fancy fonts.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-end">
              <div className="border-l-2 border-t-2 border-foreground p-8 bg-surface shadow-sm">
                <h3 className="font-serif text-2xl font-bold mb-4">
                  Plan the whole grid.
                </h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  Fonts are just the start. EziBreezy helps you visualize your
                  entire feed, split panoramas into carousels, and schedule
                  posts for maximum reach.
                </p>
                <a
                  href="/auth/signup"
                  className="group flex items-center justify-between w-full border-2 border-foreground bg-brand-primary text-white px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-foreground transition-colors"
                >
                  <span>Start Planning Free</span>
                  <Check className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
