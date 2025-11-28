// app/(marketing)/tools/screenshot-studio/components/editor-controls.tsx

import { AspectRatio, TextLayer } from "../constants";
import { BackgroundSelector } from "./controls/background-selector";
import { TextControls } from "./controls/text-controls";
import { AspectRatioSelector } from "./controls/aspect-ratio-selector";
import { FrameControls } from "./controls/frame-controls";
import { StyleSliders } from "./controls/style-sliders";

interface EditorControlsProps {
  padding: number;
  setPadding: (val: number) => void;
  roundness: number;
  setRoundness: (val: number) => void;
  outerRoundness: number;
  setOuterRoundness: (val: number) => void;
  shadow: number;
  setShadow: (val: number) => void;
  windowChrome: boolean;
  setWindowChrome: (val: boolean) => void;
  backgroundId: string;
  setBackgroundId: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  customColors: [string, string];
  setCustomColors: (val: [string, string]) => void;
  useCustomGradient: boolean;
  setUseCustomGradient: (val: boolean) => void;
  textLayer: TextLayer;
  setTextLayer: (val: TextLayer) => void;
}

export function EditorControls({
  padding,
  setPadding,
  roundness,
  setRoundness,
  outerRoundness,
  setOuterRoundness,
  shadow,
  setShadow,
  windowChrome,
  setWindowChrome,
  backgroundId,
  setBackgroundId,
  aspectRatio,
  setAspectRatio,
  customColors,
  setCustomColors,
  useCustomGradient,
  setUseCustomGradient,
  textLayer,
  setTextLayer,
}: EditorControlsProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <BackgroundSelector
        backgroundId={backgroundId}
        setBackgroundId={setBackgroundId}
        customColors={customColors}
        setCustomColors={setCustomColors}
        useCustomGradient={useCustomGradient}
        setUseCustomGradient={setUseCustomGradient}
      />

      <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

      <TextControls textLayer={textLayer} setTextLayer={setTextLayer} />

      <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

      <AspectRatioSelector
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
      />

      <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

      <FrameControls
        windowChrome={windowChrome}
        setWindowChrome={setWindowChrome}
      />

      <StyleSliders
        padding={padding}
        setPadding={setPadding}
        roundness={roundness}
        setRoundness={setRoundness}
        outerRoundness={outerRoundness}
        setOuterRoundness={setOuterRoundness}
        shadow={shadow}
        setShadow={setShadow}
      />
    </div>
  );
}
