"use client";

import { useEffect, useRef } from "react";

interface BuildOverlayProps {
  open: boolean;
  onClose: () => void;
}

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
};

export function BuildOverlay({ open, onClose }: BuildOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
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

  // click to add nodes
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hue = (timeRef.current * 0.05 + x * 0.2 + y * 0.1) % 360;
      nodesRef.current.push({ x, y, vx: 0, vy: 0, hue });
    };

    const handleDbl = () => onClose();

    window.addEventListener("click", handleClick);
    window.addEventListener("dblclick", handleDbl);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("dblclick", handleDbl);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      stop();
      return;
    }
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const start = () => {
    const canvas = canvasRef.current;
    if (!canvas || rafRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gravity = 0.08;
    const friction = 0.98;
    const springDist = 90;
    const springStrength = 0.005;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      timeRef.current += 16;
      const t = timeRef.current;
      const nodes = nodesRef.current;

      // background gradient
      const baseHue = (t * 0.01) % 360;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, `hsl(${(baseHue + 40) % 360}, 70%, 25%)`);
      g.addColorStop(1, `hsl(${(baseHue + 180) % 360}, 70%, 18%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // physics update
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.vy += gravity;
        a.vx *= friction;
        a.vy *= friction;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < springDist && dist > 0) {
            const force = (springDist - dist) * springStrength;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            a.vx -= fx;
            a.vy -= fy;
            b.vx += fx;
            b.vy += fy;
          }
        }

        a.x += a.vx;
        a.y += a.vy;

        // floor + walls bounce
        if (a.x < 0) {
          a.x = 0;
          a.vx *= -0.6;
        }
        if (a.x > w) {
          a.x = w;
          a.vx *= -0.6;
        }
        if (a.y > h - 20) {
          a.y = h - 20;
          a.vy *= -0.7;
        }
      }

      // draw connecting lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < springDist) {
            const alpha = 1 - dist / springDist;
            const hue = (a.hue + b.hue + baseHue) / 3;
            ctx.strokeStyle = `hsla(${hue % 360}, 85%, 60%, ${0.3 * alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const hue = (n.hue + baseHue) % 360;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 10);
        grad.addColorStop(0, `hsla(${hue}, 100%, 70%, 1)`);
        grad.addColorStop(1, `hsla(${hue}, 80%, 30%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);
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

  return (
    <div className="fixed inset-0 z-40" onClick={() => {}}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.24em] text-slate-200/70 pointer-events-none">
        Build layer
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[7px] text-slate-200/60 pointer-events-none">
        Click to add nodes. Double-click or press Esc to return.
      </div>
    </div>
  );
}
