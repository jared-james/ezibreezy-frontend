// app/(marketing)/tools/screenshot-studio/constants.ts

import {
  Maximize,
  Square,
  Monitor,
  Crop,
  LayoutTemplate,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

// Types
export type BackgroundStyle = {
  id: string;
  type: "solid" | "gradient" | "glass" | "custom";
  value: string | string[];
  label: string;
};

export type AspectRatio =
  | "auto"
  | "1:1"
  | "4:5"
  | "16:9"
  | "1.91:1"
  | "3:2"
  | "4:3"
  | "9:16";

export type TextLayer = {
  text: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
  fontFamily: string;
};

// Curated "Creator Economy" Palette
export const BACKGROUND_OPTIONS: BackgroundStyle[] = [
  // --- ROW 1: Essentials ---
  { id: "solid_white", type: "solid", value: "#ffffff", label: "White" },
  { id: "solid_offwhite", type: "solid", value: "#f3f4f6", label: "Off White" },
  { id: "solid_black", type: "solid", value: "#000000", label: "Black" },
  { id: "solid_dark", type: "solid", value: "#111827", label: "Dark" },
  { id: "brand_blue", type: "solid", value: "#3b82f6", label: "Blue" },
  { id: "brand_indigo", type: "solid", value: "#4f46e5", label: "Indigo" },

  // --- ROW 2: Trending Gradients (Hyper) ---
  {
    id: "hyper_1",
    type: "gradient",
    value: ["#EC4899", "#8B5CF6"],
    label: "Hyper Pink",
  },
  {
    id: "hyper_2",
    type: "gradient",
    value: ["#3B82F6", "#06B6D4"],
    label: "Oceanic",
  },
  {
    id: "hyper_3",
    type: "gradient",
    value: ["#F97316", "#db2777"],
    label: "Sunset",
  },
  {
    id: "hyper_4",
    type: "gradient",
    value: ["#10B981", "#3B82F6"],
    label: "Emerald",
  },
  {
    id: "hyper_5",
    type: "gradient",
    value: ["#8B5CF6", "#F472B6"],
    label: "Unicorn",
  },
  {
    id: "hyper_6",
    type: "gradient",
    value: ["#F43F5E", "#F59E0B"],
    label: "Fire",
  },

  // --- ROW 3: Soft / Pastel ---
  {
    id: "soft_1",
    type: "gradient",
    value: ["#cfd9df", "#e2ebf0"],
    label: "Paper",
  },
  {
    id: "soft_2",
    type: "gradient",
    value: ["#fdfbfb", "#ebedee"],
    label: "Snow",
  },
  {
    id: "soft_3",
    type: "gradient",
    value: ["#a18cd1", "#fbc2eb"],
    label: "Lavender",
  },
  {
    id: "soft_4",
    type: "gradient",
    value: ["#fad0c4", "#ffd1ff"],
    label: "Peach",
  },
  {
    id: "soft_5",
    type: "gradient",
    value: ["#ff9a9e", "#fecfef"],
    label: "Candy",
  },
  {
    id: "soft_6",
    type: "gradient",
    value: ["#e0c3fc", "#8ec5fc"],
    label: "Haze",
  },

  // --- ROW 4: Dark / Deep ---
  {
    id: "dark_1",
    type: "gradient",
    value: ["#0f172a", "#334155"],
    label: "Slate",
  },
  {
    id: "dark_2",
    type: "gradient",
    value: ["#1e1b4b", "#4338ca"],
    label: "Midnight",
  },
  {
    id: "dark_3",
    type: "gradient",
    value: ["#000000", "#434343"],
    label: "Carbon",
  },
  {
    id: "dark_4",
    type: "gradient",
    value: ["#09203f", "#537895"],
    label: "Deep Sea",
  },
  {
    id: "dark_5",
    type: "gradient",
    value: ["#4b6cb7", "#182848"],
    label: "Navy",
  },
  {
    id: "dark_6",
    type: "gradient",
    value: ["#141E30", "#243B55"],
    label: "Royal",
  },
];

export const RATIOS: {
  id: AspectRatio;
  icon: LucideIcon;
  label: string;
  subLabel?: string;
}[] = [
  { id: "auto", icon: Maximize, label: "Auto", subLabel: "Fit" },
  { id: "1:1", icon: Square, label: "Square", subLabel: "Insta" },
  { id: "4:5", icon: Square, label: "Portrait", subLabel: "Feed" },
  { id: "16:9", icon: Monitor, label: "Landscape", subLabel: "YT" },
  { id: "1.91:1", icon: Monitor, label: "Link", subLabel: "X/Meta" },
  { id: "3:2", icon: Crop, label: "Photo", subLabel: "Classic" },
  { id: "4:3", icon: LayoutTemplate, label: "Standard", subLabel: "Web" },
  { id: "9:16", icon: Smartphone, label: "Story", subLabel: "Reels" },
];

export const DEFAULT_SETTINGS = {
  padding: 60,
  roundness: 12,
  outerRoundness: 0,
  shadow: 50,
  windowChrome: false,
  backgroundId: "grad_1",
  aspectRatio: "auto" as AspectRatio,
  textLayer: {
    text: "",
    color: "#000000",
    fontSize: 28,
    x: 50,
    y: 50,
    fontFamily: "serif",
  },
};
