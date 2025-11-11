"use client";

import { useEffect, useRef } from "react";

interface FocusOverlayProps {
  open: boolean;
  onClose: () => void;
}

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function FocusOverlay({ open, onClose }: FocusOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const timeRef = useRef(0);

  // esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // pointer tracking
  useEffect(() => {
    if (!open) return;
    const move = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      pointerRef.current = { x: e.clientX / w, y: e.clientY / h };
    };
    const leave = () => {
      pointerRef.current = null;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      stop();
      return;
    }
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const initDots = (w: number, h: number) => {
    const count = Math.floor((w * h) / 20000); // moderate density
    const dots: Dot[] = [];
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
      });
    }
    dotsRef.current = dots;
  };

  const start = () => {
    const canvas = canvasRef.current;
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
        initDots(w, h);
      }

      timeRef.current += 16;
      const t = timeRef.current;
      const dots = dotsRef.current;
      const pointer = pointerRef.current;

      // background: very subtle gradient
      const baseHue = 220;
      ctx.fillStyle = `radial-gradient(circle at 50% 40%, hsl(${baseHue},40%,9%), hsl(${baseHue},40%,4%))`;
      // gradient via rect fallback
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `hsl(${baseHue},40%,9%)`);
      g.addColorStop(1, `hsl(${baseHue},40%,3%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // target: center, slowly pulsing radius
      const cx = w / 2;
      const cy = h / 2;
      const pulse = 40 + 6 * Math.sin(t * 0.0015);

      // soft focus ring
      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(148, 163, 253, 0.16)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // physics
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // base pull to center
        let tx = cx;
        let ty = cy;

        // if pointer present, bias towards pointer instead
        if (pointer) {
          tx = pointer.x * w * 0.6 + cx * 0.4;
          ty = pointer.y * h * 0.6 + cy * 0.4;
        }

        const dx = tx - d.x;
        const dy = ty - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = Math.min(0.018, 0.002 + 80 / (dist * dist + 20000));
        d.vx += (dx / dist) * force;
        d.vy += (dy / dist) * force;

        // damping
        d.vx *= 0.94;
        d.vy *= 0.94;

        d.x += d.vx;
        d.y += d.vy;

        // draw
        const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        const alpha = 0.2 + Math.min(speed * 18, 0.6);
        const hue = baseHue + 20 * Math.sin(t * 0.0004 + i * 0.1);

        ctx.fillStyle = `hsla(${hue}, 70%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
  };

  const stop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  };

  if (!open) return null;

  const handleClick = () => onClose();

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.24em] text-slate-400/80 pointer-events-none">
        Focus layer
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[7px] text-slate-500/80 pointer-events-none">
        Click or press Esc to return
      </div>
    </div>
  );
}
