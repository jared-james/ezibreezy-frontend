// app/(marketing)/tools/screenshot-studio/hooks/use-text-drag.ts

import { useRef } from "react";
import { TextLayer } from "../constants";

interface UseTextDragParams {
  textLayer: TextLayer;
  setTextLayer: (layer: TextLayer) => void;
  canvasWrapperRef: React.RefObject<HTMLDivElement | null>;
}

export function useTextDrag({
  textLayer,
  setTextLayer,
  canvasWrapperRef,
}: UseTextDragParams) {
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startTextX: 0,
    startTextY: 0,
  });

  const textElementRef = useRef<HTMLDivElement>(null);

  const handleTextMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasWrapperRef.current || !textElementRef.current) return;

    e.preventDefault();

    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startTextX: textLayer.x,
      startTextY: textLayer.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragState.current.isDragging || !canvasWrapperRef.current) return;

      const bounds = canvasWrapperRef.current.getBoundingClientRect();

      // Calculate total distance moved in pixels
      const deltaX = moveEvent.clientX - dragState.current.startX;
      const deltaY = moveEvent.clientY - dragState.current.startY;

      // Convert to percentage
      const deltaXPercent = (deltaX / bounds.width) * 100;
      const deltaYPercent = (deltaY / bounds.height) * 100;

      // Add to starting position
      const newX = dragState.current.startTextX + deltaXPercent;
      const newY = dragState.current.startTextY + deltaYPercent;

      // Clamp to bounds
      const safeX = Math.max(0, Math.min(100, newX));
      const safeY = Math.max(0, Math.min(100, newY));

      setTextLayer({
        ...textLayer,
        x: safeX,
        y: safeY,
      });
    };

    const handleMouseUp = () => {
      dragState.current.isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return {
    textElementRef,
    handleTextMouseDown,
  };
}
