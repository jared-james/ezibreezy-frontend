import { useState, useEffect } from "react";
import { Type, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- MAPPING LOGIC ---
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
  bubble: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨",
  small_caps: "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789",
};

const STYLES = [
  { id: "sans_bold", label: "Bold (Sans)" },
  { id: "sans_italic", label: "Italic (Sans)" },
  { id: "sans_bold_italic", label: "Bold Italic" },
  { id: "serif_bold", label: "Bold (Serif)" },
  { id: "serif_italic", label: "Italic (Serif)" },
  { id: "strikethrough", label: "Strikethrough" }, // New
  { id: "underline", label: "Underline" }, // New
  { id: "script", label: "Script" },
  { id: "script_bold", label: "Bold Script" },
  { id: "small_caps", label: "Small Caps" }, // New
  { id: "bubble", label: "Bubble Text" }, // New
  { id: "monospace", label: "Monospace" },
  { id: "double_struck", label: "Blackboard" },
];

function convertText(text: string, styleId: string): string {
  // Handle Combining Diacritics (Strikethrough & Underline)
  // We apply the combining character AFTER every single character in the string
  if (styleId === "strikethrough") {
    return [...text].map((char) => char + "\u0336").join("");
  }
  if (styleId === "underline") {
    return [...text].map((char) => char + "\u0332").join("");
  }

  // Handle Mapping Replacements
  const map = MAPS[styleId];
  if (!map) return text;

  return text
    .split("")
    .map((char) => {
      const index = ALPHABET.indexOf(char);
      if (index === -1) return char;
      // Spread map to handle surrogate pairs correctly (e.g., 𝐚 is two code units)
      return [...map][index] || char;
    })
    .join("");
}

interface ConverterPanelProps {
  inputText: string;
  onInputChange: (val: string) => void;
  selectedStyle: string;
  onStyleSelect: (id: string) => void;
  onPreviewUpdate: (text: string) => void;
}

export function ConverterPanel({
  inputText,
  onInputChange,
  selectedStyle,
  onStyleSelect,
  onPreviewUpdate,
}: ConverterPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update parent preview whenever input or selection changes
  useEffect(() => {
    onPreviewUpdate(convertText(inputText, selectedStyle));
  }, [inputText, selectedStyle, onPreviewUpdate]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-foreground/50">
          <label className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
            <Type className="w-3 h-3" />
            Source Text
          </label>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-foreground/10">
            {inputText.length} Chars
          </span>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type the text you want to format here..."
          className="w-full h-32 p-4 bg-white border-2 border-dashed border-foreground/30 focus:border-brand-primary focus:outline-none font-serif text-xl leading-tight resize-none transition-colors"
        />
      </div>

      {/* Style Selector List */}
      <div className="space-y-4">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
          Select Output Style
        </label>

        <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {STYLES.map((style) => {
            const preview = inputText
              ? convertText(inputText, style.id)
              : style.label;
            const isActive = selectedStyle === style.id;

            return (
              <div
                key={style.id}
                onClick={() => onStyleSelect(style.id)}
                className={cn(
                  "group relative flex items-center justify-between p-4 border cursor-pointer transition-all duration-200",
                  isActive
                    ? "bg-brand-primary/5 border-brand-primary shadow-sm"
                    : "bg-white border-foreground/10 hover:border-foreground/30 hover:bg-surface-hover"
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary" />
                )}

                <div className="flex flex-col gap-1 min-w-0 pr-4">
                  <span
                    className={cn(
                      "text-sm font-medium truncate font-sans text-foreground",
                      // Specific tweak for script fonts to ensure they don't get cut off
                      style.id.includes("script") && "py-1"
                    )}
                  >
                    {preview}
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
                    isActive ? "text-brand-primary" : "text-foreground/40"
                  )}
                  title="Copy this style"
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
  );
}
