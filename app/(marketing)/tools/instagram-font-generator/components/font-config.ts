// app/(marketing)/tools/instagram-font-generator/components/font-config.ts

export const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const MAPS: Record<string, string> = {
  serif_normal:
    "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  serif_bold: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  serif_italic:
    "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍0123456789",
  serif_bold_italic:
    "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁0123456789",
  sans_normal: "𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫",
  sans_bold: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  sans_italic: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789",
  sans_bold_italic:
    "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕0123456789",
  script: "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789",
  script_bold: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  fraktur: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ0123456789",
  fraktur_bold:
    "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅0123456789",
  monospace: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
  double_struck:
    "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
  small_caps: "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789",
  full_width:
    "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９",
  bubble: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨",
  bubble_black:
    "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅉🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅉⓿❶❷❸❹❺❻❼❽❾",
  square: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789",
  square_black:
    "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉0123456789",
  parenthesis: "⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵⑴⑵⑶⑷⑸⑹⑺⑻⑼",
  upside_down: "zʎxʍʌnʇsɹbdouɯlʞɾıɥƃɟǝpɔqɐZ⅄XMΛ∩⊥SᴚΌԀONW˥➦ſIH⅁ℲƎpƆq∀0123456789",
  greek_ish: "αвc∂єƒgнιנкℓмиσρqяѕтυνωχуzαвc∂єƒgнιנкℓмиσρqяѕтυνωχуz0123456789",
  soviet: "авcdeғgнijкlмиopqяsтuvwxyzАБCDЭFGHЇJКLМИOРQЯSТЦVЩXYZ0123456789",
  currency: "₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ0123456789",
  tiny: "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹",
  superscript: "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂXYᶻ⁰¹²³⁴⁵⁶⁷⁸⁹",
  subscript: "ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyzABCDEFGHIJKLMNOPQRSTUVWXYZ₀₁₂₃₄₅₆₇₈₉",
};

export const STYLES = [
  { id: "sans_normal", label: "Sans (Normal)" },
  { id: "sans_bold", label: "Bold (Sans)" },
  { id: "sans_italic", label: "Italic (Sans)" },
  { id: "sans_bold_italic", label: "Bold Italic (Sans)" },
  { id: "serif_normal", label: "Serif (Normal)" },
  { id: "serif_bold", label: "Bold (Serif)" },
  { id: "serif_italic", label: "Italic (Serif)" },
  { id: "serif_bold_italic", label: "Bold Italic (Serif)" },
  { id: "script", label: "Script (Cursive)" },
  { id: "script_bold", label: "Bold Script" },
  { id: "fraktur", label: "Gothic / Old English" },
  { id: "fraktur_bold", label: "Bold Gothic" },
  { id: "double_struck", label: "Outline / Double Struck" },
  { id: "monospace", label: "Monospace / Typewriter" },
  { id: "full_width", label: "Full Width / Vaporwave" },
  { id: "small_caps", label: "Small Caps" },
  { id: "bubble", label: "Bubble Circles" },
  { id: "bubble_black", label: "Black Circles" },
  { id: "square", label: "Square Box" },
  { id: "square_black", label: "Black Box" },
  { id: "parenthesis", label: "Parenthesis" },
  { id: "upside_down", label: "Upside Down / Flip" },
  { id: "greek_ish", label: "Greek Style" },
  { id: "soviet", label: "Soviet Style" },
  { id: "currency", label: "Currency Style" },
  { id: "tiny", label: "Tiny Text" },
  { id: "superscript", label: "Superscript" },
  { id: "subscript", label: "Subscript" },
  { id: "wide_spaced", label: "Wide Spaced" },
  { id: "alternating_caps", label: "Alternating Caps" },
  { id: "bracketed", label: "Bracketed Header" },
  { id: "zalgo", label: "Glitch / Zalgo" },
  { id: "strikethrough", label: "Strikethrough" },
  { id: "underline", label: "Underline" },
  { id: "slash_through", label: "Slash Through" },
  { id: "tilde_strike", label: "Tilde Strike" },
];

export const ZALGO_MARKS = [
  "\u030d",
  "\u030e",
  "\u0304",
  "\u0305",
  "\u033f",
  "\u0311",
  "\u0306",
  "\u0310",
  "\u0352",
  "\u0357",
  "\u0351",
  "\u0307",
  "\u0308",
  "\u030a",
  "\u0342",
  "\u0343",
  "\u0344",
  "\u034a",
  "\u034b",
  "\u034c",
  "\u0303",
  "\u0302",
  "\u030c",
  "\u0350",
  "\u0300",
  "\u0301",
  "\u030b",
  "\u030f",
  "\u0312",
  "\u0313",
  "\u0314",
  "\u033d",
  "\u0309",
  "\u0363",
  "\u0364",
  "\u0365",
  "\u0366",
  "\u0367",
  "\u0368",
  "\u0369",
  "\u036a",
];

export function convertText(text: string, styleId: string): string {
  if (styleId === "upside_down") {
    const map = MAPS[styleId];
    return text
      .split("")
      .reverse()
      .map((char) => {
        const index = ALPHABET.indexOf(char);
        if (index === -1) return char;
        return [...map][index] || char;
      })
      .join("");
  }

  if (styleId === "wide_spaced") {
    return text.split("").join(" ");
  }

  if (styleId === "alternating_caps") {
    let toggle = 0;
    return text
      .split("")
      .map((char) => {
        if (/[a-zA-Z]/.test(char)) {
          const result =
            toggle % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
          toggle += 1;
          return result;
        }
        return char;
      })
      .join("");
  }

  if (styleId === "zalgo") {
    return text
      .split("")
      .map((char) => {
        if (char === " ") return char;
        let result = char;
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i += 1) {
          const mark =
            ZALGO_MARKS[Math.floor(Math.random() * ZALGO_MARKS.length)];
          result += mark;
        }
        return result;
      })
      .join("");
  }

  if (styleId === "bracketed") {
    if (!text) return text;
    return `【${text}】`;
  }

  if (styleId === "strikethrough") {
    return text
      .split("")
      .map((c) => c + "\u0336")
      .join("");
  }

  if (styleId === "underline") {
    return text
      .split("")
      .map((c) => c + "\u0332")
      .join("");
  }

  if (styleId === "slash_through") {
    return text
      .split("")
      .map((c) => c + "\u0338")
      .join("");
  }

  if (styleId === "tilde_strike") {
    return text
      .split("")
      .map((c) => c + "\u0334")
      .join("");
  }

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
