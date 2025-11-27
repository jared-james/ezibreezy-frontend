// components/landing-page/interactive-whiteboard.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";

const drawInitialHint = (context: CanvasRenderingContext2D) => {
  context.save();
  context.strokeStyle = "rgba(234, 88, 12, 0.3)";
  context.lineWidth = 2;

  context.beginPath();
  context.arc(300, 300, 50, 0, 2 * Math.PI);
  context.stroke();

  context.beginPath();
  context.moveTo(350, 300);
  context.bezierCurveTo(400, 300, 400, 400, 450, 450);
  context.stroke();

  context.beginPath();
  context.moveTo(450, 450);
  context.lineTo(440, 430);
  context.moveTo(450, 450);
  context.lineTo(430, 440);
  context.stroke();

  context.restore();
};

export default function InteractiveWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 750;

    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 3;
      context.strokeStyle = "#ea580c";
      setCtx(context);

      const saved = localStorage.getItem("end-to-end-doodle");

      if (saved) {
        const img = new Image();
        img.src = saved;
        img.onload = () => context.drawImage(img, 0, 0);
      } else {
        drawInitialHint(context);
      }
    }
  }, []);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ctx || !canvasRef.current) return;
    setIsDrawing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { offsetX, offsetY } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    const { offsetX, offsetY } = getCoords(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ctx || !canvasRef.current) return;
    ctx.closePath();
    setIsDrawing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    localStorage.setItem("end-to-end-doodle", canvasRef.current.toDataURL());
  };

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY,
    };
  };

  const clearBoard = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    localStorage.removeItem("end-to-end-doodle");
  };

  return (
    <div className="lg:col-span-5 flex items-center justify-center mt-8 lg:mt-0">
      <div className="relative w-full border-2 border-foreground bg-background p-1 rounded-sm shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
        <div className="relative aspect-4/5 w-full bg-[#f4f4f0] border border-foreground/10 overflow-hidden group cursor-crosshair rounded-sm">
          <div
            className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: 'url("/background_logo_02.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            className="absolute inset-0 w-full h-full touch-none z-20"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 opacity-10 select-none">
            <span className="font-serif text-5xl italic whitespace-nowrap">
              Your Canvas,
            </span>
            <span className="font-serif text-5xl italic whitespace-nowrap">
              our technology
            </span>
          </div>

          <div className="absolute top-4 right-4 z-30 flex">
            <button
              onClick={clearBoard}
              className="bg-background border border-foreground p-2 rounded-full transition-opacity shadow-sm opacity-60 hover:opacity-100"
              title="Clear Board"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-foreground p-3 bg-surface">
          <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-foreground/60">
            <span>Fig 2.0</span>
            <span>Your Whiteboard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
