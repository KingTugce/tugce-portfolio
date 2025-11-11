"use client";

import { useEffect, useRef } from "react";

interface PlayOverlayProps {
  open: boolean;
  onClose: () => void;
}

type Cell = {
  x: number;
  y: number;
  phase: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hueOffset: number;
};

export function PlayOverlay({ open, onClose }: PlayOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const cellsRef = useRef<Cell[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const timeRef = useRef(0);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Pointer tracking
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

  const initScene = (w: number, h: number) => {
    // Mosaic grid
    const cellSize = Math.max(16, Math.min(w, h) / 32);
    const cols = Math.ceil(w / cellSize);
    const rows = Math.ceil(h / cellSize);

    const cells: Cell[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        cells.push({
          x: x * cellSize + cellSize / 2,
          y: y * cellSize + cellSize / 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    cellsRef.current = cells;

    // Light-flow particles
    const particleCount = Math.floor((w * h) / 15000); // tuned
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        hueOffset: Math.random() * 360,
      });
    }
    particlesRef.current = particles;
  };

  const fieldAngle = (x: number, y: number, t: number) => {
    // Smooth organic flow; tuned for Gaudí-curves
    const nx = x * 0.0012;
    const ny = y * 0.0012;
    return (
      Math.sin(nx * 1.7 + t * 0.0006) +
      Math.cos(ny * 2.1 - t * 0.0004) +
      Math.sin((nx + ny) * 1.3 + t * 0.0003)
    ) * 0.6;
  };

  const paletteStroke = (baseHue: number, band: number, lShift = 0) => {
    // Gaudí + Refik: terracotta, turquoise, cobalt, gold, magenta
    if (band === 0) {
      return `hsl(${(baseHue + 25) % 360}, 82%, ${50 + lShift}%)`; // warm orange/gold
    }
    if (band === 1) {
      return `hsl(${(baseHue + 180) % 360}, 78%, ${48 + lShift}%)`; // deep teal / cyan
    }
    return `hsl(${(baseHue + 300) % 360}, 80%, ${52 + lShift}%)`; // magenta/violet
  };

  const start = () => {
    const canvas = canvasRef.current;
    if (!canvas || rafRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
        canvas.width = vw * dpr;
        canvas.height = vh * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initScene(vw, vh);
      }

      timeRef.current += 16;
      const t = timeRef.current;
      const pointer = pointerRef.current;

      // Background: layered color fields (no black void)
      const baseHue = (t * 0.004) % 360;
      const g = ctx.createLinearGradient(0, 0, vw, vh);
      g.addColorStop(0, `hsl(${(baseHue + 20) % 360}, 70%, 22%)`);
      g.addColorStop(0.5, `hsl(${(baseHue + 140) % 360}, 65%, 17%)`);
      g.addColorStop(1, `hsl(${(baseHue + 280) % 360}, 75%, 20%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, vw, vh);

      // Mosaic strokes (Gaudí tiles in motion)
      const cells = cellsRef.current;
      ctx.lineWidth = 1.1;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];

        const angle = fieldAngle(c.x, c.y, t);
        const length = 10 + 18 * Math.sin(c.phase + t * 0.0007);

        let x2 = c.x + Math.cos(angle) * length;
        let y2 = c.y + Math.sin(angle) * length;

        // pointer influence: bend nearby strokes
        if (pointer) {
          const gx = pointer.x * vw;
          const gy = pointer.y * vh;
          const dx = gx - c.x;
          const dy = gy - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < Math.min(vw, vh) * 0.35) {
            const pull = (Math.min(vw, vh) * 0.35 - dist) / (Math.min(vw, vh) * 0.35);
            x2 += dx * 0.18 * pull;
            y2 += dy * 0.18 * pull;
          }
        }

        const band = i % 3;
        ctx.strokeStyle = paletteStroke(baseHue, band, (band - 1) * 4);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Light-flow particles (Refik-style streaks weaving through)
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const angle = fieldAngle(p.x, p.y, t) * 1.4;
        const speed = 1.4;

        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;

        if (pointer) {
          const gx = pointer.x * vw;
          const gy = pointer.y * vh;
          const dx = gx - p.x;
          const dy = gy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < Math.min(vw, vh) * 0.4) {
            const influence = (Math.min(vw, vh) * 0.4 - dist) / (Math.min(vw, vh) * 0.4);
            p.vx += (dx / dist) * influence * 1.2;
            p.vy += (dy / dist) * influence * 1.2;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -20) p.x = vw + 20;
        if (p.x > vw + 20) p.x = -20;
        if (p.y < -20) p.y = vh + 20;
        if (p.y > vh + 20) p.y = -20;

        const hue = (baseHue + p.hueOffset) % 360;
        ctx.strokeStyle = `hsla(${hue}, 88%, 66%, 0.9)`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2.4, p.y - p.vy * 2.4);
        ctx.stroke();
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

  const handleClick = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.24em] text-slate-200/70 pointer-events-none">
        Play layer
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[7px] text-slate-200/60 pointer-events-none">
        Click or press Esc to return
      </div>
    </div>
  );
}
