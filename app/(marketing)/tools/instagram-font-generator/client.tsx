// app/(marketing)/tools/instagram-font-generator/client.tsx

"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Check, Type } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { STYLES, convertText } from "./components/font-config";

export default function FontGeneratorClient() {
  const [inputText, setInputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("sans_bold");
  const [previewText, setPreviewText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const textToConvert = inputText || "Preview Text";
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
    <main className="flex-1 py-12 px-4 md:px-8 relative bg-background-editorial">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight uppercase">
            Instagram Font Generator
          </h1>
          <p className="font-serif text-lg text-foreground/70 max-w-2xl">
            Type your text and choose from 25+ aesthetic font styles.
          </p>
        </div>

        <div className="bg-white border-2 border-foreground p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col xl:flex-row xl:items-start min-h-[600px] border border-dashed border-foreground/30">
            <div className="w-full xl:w-5/12 p-4 md:p-6 flex flex-col gap-4 border-b xl:border-b-0 xl:border-r border-dashed border-foreground/30 bg-zinc-50/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-foreground/60">
                  <label className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 font-bold">
                    <Type className="w-3 h-3" />
                    Input
                  </label>
                  <button
                    onClick={handleReset}
                    className="text-xs hover:text-brand-primary flex items-center gap-1 font-medium transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Clear
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your bio or caption here..."
                  className="w-full h-24 p-3 bg-white border border-foreground/20 rounded-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary font-serif text-lg leading-tight resize-none transition-all placeholder:text-foreground/30"
                />
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                    Results ({STYLES.length})
                  </label>
                  <span className="text-[10px] text-foreground/40">
                    Scroll for more
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                  {STYLES.map((style) => {
                    const converted = inputText
                      ? convertText(inputText, style.id)
                      : style.label;
                    const isActive = selectedStyle === style.id;

                    return (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={cn(
                          "group relative flex items-center justify-between px-3 py-2 border rounded-sm cursor-pointer transition-all duration-150 select-none",
                          isActive
                            ? "bg-brand-primary/10 border-brand-primary/50"
                            : "bg-white border-transparent hover:border-foreground/10 hover:bg-white"
                        )}
                      >
                        <div className="flex flex-col min-w-0 pr-3 overflow-hidden">
                          <span className="text-base truncate text-foreground leading-snug">
                            {converted}
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
                            "p-1.5 rounded hover:bg-foreground/10 transition-colors shrink-0",
                            isActive
                              ? "text-brand-primary"
                              : "text-foreground/30 group-hover:text-foreground/60"
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

            <div className="w-full xl:w-7/12 relative xl:sticky xl:top-8">
              <div className=" p-8 min-h-full flex items-center justify-center overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="relative w-[340px] bg-white rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl overflow-hidden z-10">
                  <div className="h-7 bg-white flex justify-between items-center px-6 pt-1">
                    <span className="text-[10px] font-bold text-black">
                      9:41
                    </span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-black rounded-full opacity-10" />
                      <div className="w-3 h-3 bg-black rounded-full opacity-10" />
                    </div>
                  </div>

                  <div className="px-5 pt-3 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-sm">ezibreezy_app</span>
                      <div className="w-5 h-5 border-2 border-black rounded-full" />
                    </div>

                    <div className="flex items-center gap-6 mb-5">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white p-[2px]">
                          <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                            <img
                              src="/placeholder-avatar.jpg"
                              alt=""
                              className="w-full h-full object-cover opacity-0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex justify-between px-1 text-center">
                        <div>
                          <div className="font-bold text-sm">1.2k</div>
                          <div className="text-[10px] text-gray-500">Posts</div>
                        </div>
                        <div>
                          <div className="font-bold text-sm">48K</div>
                          <div className="text-[10px] text-gray-500">
                            Followers
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-sm">340</div>
                          <div className="text-[10px] text-gray-500">
                            Following
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed space-y-1">
                      <div className="font-bold">
                        {inputText ? previewText : "Your Name"}
                      </div>
                      <div className="text-gray-500">Digital Creator</div>
                      <div className="whitespace-pre-wrap">
                        {inputText ? (
                          <>
                            This is a preview of your bio.
                            <br />
                            Font:{" "}
                            <strong>
                              {
                                STYLES.find((s) => s.id === selectedStyle)
                                  ?.label
                              }
                            </strong>
                            <br />✨ Make your profile stand out.
                          </>
                        ) : (
                          "Create aesthetic bios & captions.\nCopy and paste fancy fonts.\n👇 Try the tool now"
                        )}
                      </div>
                      <div className="text-blue-900 font-medium">
                        ezibreezy.com
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 bg-zinc-100 py-1.5 rounded text-xs font-bold text-center">
                        Edit Profile
                      </div>
                      <div className="flex-1 bg-zinc-100 py-1.5 rounded text-xs font-bold text-center">
                        Share
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 px-4 py-3 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-14 h-14 rounded-full border border-gray-200 bg-zinc-50" />
                        <div className="w-8 h-1.5 bg-zinc-100 rounded" />
                      </div>
                    ))}
                  </div>

                  <div className="flex border-t border-gray-100 mt-1">
                    <div className="flex-1 py-2.5 border-b border-black flex justify-center">
                      <div className="w-4 h-4 bg-black" />
                    </div>
                    <div className="flex-1 py-2.5 flex justify-center">
                      <div className="w-4 h-4 border border-black" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-0.5 bg-white mb-8">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-zinc-100 hover:bg-zinc-200 transition-colors"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
