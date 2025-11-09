"use client";

import { useEffect, useRef } from "react";

type Star = {
  id: number;
  x: number; // 0–1
  y: number; // 0–1
  mag: number;
};

interface PlayOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function PlayOverlay({ open, onClose }: PlayOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const starsRef = useRef<Star[] | null>(null);

  // load star data when opened
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadStars = async () => {
      try {
        const res = await fetch("/data/stars.json");
        if (!res.ok) return;
        const data = (await res.json()) as Star[];
        if (!cancelled) {
          starsRef.current = data;
          start();
        }
      } catch {
        // silent fail, still show empty sky
        start();
      }
    };

    loadStars();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", handleKey);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) stop();
  }, [open]);

  const start = () => {
    const canvas = canvasRef.current;
    const stars = starsRef.current;
    if (!canvas || rafRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      // background
      const g = ctx.createRadialGradient(
        w * 0.5,
        h * 0.2,
        0,
        w * 0.5,
        h * 0.7,
        Math.max(w, h)
      );
      g.addColorStop(0, "#020817");
      g.addColorStop(1, "#000814");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const t = performance.now() * 0.00005;
      const starsList = stars || [];

      // draw stars with subtle drift + flicker
      for (const s of starsList) {
        const parallax = 1 + (1.6 - s.mag) * 0.06;
        const px = (s.x + t * 0.02 * parallax) % 1;
        const py = (s.y + t * 0.01 * parallax) % 1;

        const x = px * w;
        const y = py * h;

        const base = Math.max(0.4, 2.2 - s.mag * 0.6);
        const flicker = 0.3 + 0.7 * Math.abs(Math.sin(t * 7 + s.id));
        const r = base * flicker;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148,163,253,0.9)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const stop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  };

  const handleClick = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm cursor-none"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.24em] text-slate-500 pointer-events-none">
        Sky layer
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 pointer-events-none">
        Click or press Esc to return
      </div>
    </div>
  );
}
