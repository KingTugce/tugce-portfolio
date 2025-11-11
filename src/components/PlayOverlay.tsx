"use client";

import { useEffect, useRef } from "react";

interface PlayOverlayProps {
  open: boolean;
  onClose: () => void;
}

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  phase: number;
};

export function PlayOverlay({ open, onClose }: PlayOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const timeRef = useRef(0);

  // close on Esc
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);

  // track pointer for field distortion
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

  // init + animation
  useEffect(() => {
    if (!open) {
      stop();
      return;
    }
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const initParticles = (w: number, h: number) => {
    const count = Math.floor((w * h) / 9000); // density tuned: ~80-2000
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      particles.push({
        x,
        y,
        px: x,
        py: y,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  };

  const fieldAngle = (x: number, y: number, t: number) => {
    // smooth, layered trig field for fluid motion
    const nx = x * 0.0014;
    const ny = y * 0.0014;
    const a =
      Math.sin(nx * 2.3 + t * 0.0007) +
      Math.cos(ny * 1.9 - t * 0.0004) +
      Math.sin((nx + ny) * 1.3 + t * 0.0009);
    return a * 0.9; // scale down for calmer flows
  };

  const colorFor = (p: Particle, t: number) => {
    // two-band palette shifting over time
    const base = (t * 0.00003 + p.phase * 0.15) % (Math.PI * 2);
    const band = base < Math.PI ? 1 : 2;

    if (band === 1) {
      // electric cyan / azure
      const l = 45 + 15 * Math.sin(base * 2 + p.phase);
      return `hsl(190, 86%, ${l}%)`;
    } else {
      // magenta / violet
      const l = 40 + 18 * Math.cos(base * 2 + p.phase);
      return `hsl(305, 82%, ${l}%)`;
    }
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
        initParticles(w, h);
        ctx.fillStyle = "#020008";
        ctx.fillRect(0, 0, w, h);
      }

      timeRef.current += 16; // approximate ms per frame
      const t = timeRef.current;

      // fade previous frame slightly to create trails
      ctx.fillStyle = "rgba(2,0,10,0.12)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const pointer = pointerRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.px = p.x;
        p.py = p.y;

        let angle = fieldAngle(p.x, p.y, t);

        // pointer gravity: subtle, not gimmicky
        if (pointer) {
          const gx = pointer.x * w;
          const gy = pointer.y * h;
          const dx = gx - p.x;
          const dy = gy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < Math.min(w, h) * 0.45) {
            const influence = (Math.min(w, h) * 0.45 - dist) / (Math.min(w, h) * 0.45);
            angle += Math.atan2(dy, dx) * 0.12 * influence;
          }
        }

        const speed = 0.6 + 0.7 * Math.sin(p.phase + t * 0.0003);
        p.x += Math.cos(angle) * speed;
        p.y += Math.sin(angle) * speed;

        // wrap softly at edges
        if (p.x < -10) p.x = w + 8;
        if (p.x > w + 10) p.x = -8;
        if (p.y < -10) p.y = h + 8;
        if (p.y > h + 10) p.y = -8;

        // draw trail segment
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = colorFor(p, t);
        ctx.lineWidth = 0.7;
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
      className="fixed inset-0 z-40 bg-black"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.24em] text-slate-500 pointer-events-none">
        Play layer
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[7px] text-slate-600 pointer-events-none">
        Click or press Esc to return
      </div>
    </div>
  );
}
