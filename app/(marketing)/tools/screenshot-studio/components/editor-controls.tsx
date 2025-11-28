// app/(marketing)/tools/screenshot-studio/components/editor-controls.tsx

import { AspectRatio, TextLayer } from "../constants";
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
  showGlass: boolean;
  setShowGlass: (val: boolean) => void;
  glassPlane: number;
  setGlassPlane: (val: number) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
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
  showGlass,
  setShowGlass,
  glassPlane,
  setGlassPlane,
  aspectRatio,
  setAspectRatio,
  textLayer,
  setTextLayer,
}: EditorControlsProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <AspectRatioSelector
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
      />

      <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

      <TextControls textLayer={textLayer} setTextLayer={setTextLayer} />

      <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

      <FrameControls
        windowChrome={windowChrome}
        setWindowChrome={setWindowChrome}
        showGlass={showGlass}
        setShowGlass={setShowGlass}
        glassPlane={glassPlane}
        setGlassPlane={setGlassPlane}
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
