"use client";

import { useEffect, useRef, useState } from "react";

export type Mode = "play" | "dontclick" | "build" | "focus" | null;

interface ModeProps {
  onExit: () => void;
}

const backdropBase =
  "fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center px-6";

function ReturnButton({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 mt-4">
      <button
        onClick={onExit}
        className="px-5 py-2 rounded-full border border-slate-500 text-[10px] text-slate-100 hover:border-emerald-400 hover:text-emerald-300 transition-all"
      >
        Return
      </button>
      <span className="text-[7px] text-slate-500">
        or click outside this area
      </span>
    </div>
  );
}

/* -------------------- PLAY MODE -------------------- */
export function PlayMode({ onExit }: ModeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lines, setLines] = useState<[number, number][]>([]);

  // simple constellation data (Cassiopeia-like)
  const points = [
    { x: 0.15, y: 0.45 },
    { x: 0.3, y: 0.3 },
    { x: 0.45, y: 0.5 },
    { x: 0.6, y: 0.32 },
    { x: 0.78, y: 0.46 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * window.devicePixelRatio;
      canvas.height = innerHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      drawBase();
    };

    const drawBase = () => {
      if (!ctx) return;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // background gradient
      const grad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.3,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h)
      );
      grad.addColorStop(0, "#020817");
      grad.addColorStop(1, "#020617");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // random stars
      ctx.fillStyle = "rgba(148,163,253,0.28)";
      for (let i = 0; i < 140; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 1.1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // main stars
      points.forEach((p) => {
        const x = p.x * w;
        const y = p.y * h;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(129,140,248,0.98)";
        ctx.fill();
      });

      // existing lines
      drawLines();
    };

    const drawLines = () => {
      if (!ctx) return;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(56,189,248,0.9)";
      lines.forEach(([from, to]) => {
        const a = points[from];
        const b = points[to];
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [lines.length]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    let nearest = -1;
    let dist = 0.04;
    points.forEach((p, i) => {
      const dx = p.x - x;
      const dy = p.y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < dist) {
        dist = d;
        nearest = i;
      }
    });
    if (nearest === -1) return;

    setLines((prev) => {
      if (prev.length === 0) return [[0, 1]];
      const last = prev[prev.length - 1][1];
      if (last === nearest) return prev;
      if (prev.find(([a, b]) => (a === last && b === nearest) || (a === nearest && b === last))) {
        return prev;
      }
      return [...prev, [last, nearest]];
    });
  };

  return (
    <div className={backdropBase} onClick={onExit}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full flex flex-col items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />
        <div className="relative z-10 flex flex-col items-center gap-2 pointer-events-none">
          <p className="text-[9px] uppercase tracking-[0.24em] text-emerald-300">
            Constellation field
          </p>
          <p className="text-[10px] md:text-xs text-slate-300 text-center max-w-sm">
            Connect nearby luminous points. Patterns appear from genuine star positions.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <ReturnButton onExit={onExit} />
        </div>
      </div>
    </div>
  );
}

/* -------------------- DON'T CLICK MODE -------------------- */
export function DontClickMode({ onExit }: ModeProps) {
  const [particles, setParticles] = useState(
    Array.from({ length: 80 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      s: 4 + Math.random() * 6,
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          x: (p.x + (Math.random() - 0.5) * 0.05 + 1) % 1,
          y: (p.y + 0.04) % 1,
          s: p.s,
        }))
      );
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`${backdropBase} bg-gradient-to-br from-slate-950 via-fuchsia-900/40 to-amber-700/20`}
      onClick={onExit}
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-pink-400/70"
            style={{
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
              boxShadow: "0 0 12px rgba(251,113,133,0.9)",
            }}
          />
        ))}
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex flex-col items-center gap-2 px-4"
      >
        <p className="text-[9px] uppercase tracking-[0.24em] text-pink-300">
          Boundary breached
        </p>
        <p className="text-[11px] text-slate-100 text-center max-w-sm">
          Curiosity activates celebration. Only color follows.
        </p>
        <ReturnButton onExit={onExit} />
      </div>
    </div>
  );
}

/* -------------------- BUILD MODE -------------------- */
const buildBlocks = ["Interface", "Logic", "Data", "Infrastructure"] as const;
type Block = (typeof buildBlocks)[number];

export function BuildMode({ onExit }: ModeProps) {
  const [order, setOrder] = useState<Block[]>([...buildBlocks]);

  const rotate = () => {
    setOrder((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const isStable =
    JSON.stringify(order) ===
    JSON.stringify(["Interface", "Logic", "Data", "Infrastructure"]);

  return (
    <div className={backdropBase} onClick={onExit}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-950/98 border border-sky-500/40 rounded-3xl p-5 shadow-[0_0_30px_rgba(56,189,248,0.3)] flex flex-col items-center gap-3"
      >
        <p className="text-[9px] uppercase tracking-[0.24em] text-sky-400">
          Stack the system
        </p>
        <p className="text-[10px] md:text-xs text-slate-300 text-center max-w-sm">
          Tap the stack to cycle layers. When alignment feels right, structure locks into place.
        </p>
        <div
          onClick={rotate}
          className="mt-2 cursor-pointer flex flex-col gap-1 w-full max-w-xs"
        >
          {order.map((label) => (
            <div
              key={label}
              className="w-full py-2 rounded-xl bg-sky-500/10 border border-sky-500/40 text-[10px] text-sky-100 text-center tracking-wide"
            >
              {label}
            </div>
          ))}
        </div>
        {isStable && (
          <p className="text-[9px] text-emerald-300 mt-1">
            Stable architecture detected.
          </p>
        )}
        <ReturnButton onExit={onExit} />
      </div>
    </div>
  );
}

/* -------------------- FOCUS MODE -------------------- */
export function FocusMode({ onExit }: ModeProps) {
  return (
    <div className={backdropBase} onClick={onExit}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md flex flex-col items-center gap-4"
      >
        <div className="relative w-40 h-40">
          <div className="absolute inset-6 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 rounded-full border border-violet-400/40 animate-ping" />
          <div className="absolute inset-4 rounded-full border border-violet-300/60" />
        </div>
        <p className="text-[9px] uppercase tracking-[0.24em] text-violet-300">
          Focus mode
        </p>
        <p className="text-[10px] md:text-xs text-slate-300 text-center max-w-sm">
          Breathe with the pulse. One quiet pattern in a crowded field.
        </p>
        <ReturnButton onExit={onExit} />
      </div>
    </div>
  );
}

/* -------------------- AGGREGATOR -------------------- */
export function ActiveMode({ mode, onExit }: { mode: Mode; onExit: () => void }) {
  if (mode === "play") return <PlayMode onExit={onExit} />;
  if (mode === "dontclick") return <DontClickMode onExit={onExit} />;
  if (mode === "build") return <BuildMode onExit={onExit} />;
  if (mode === "focus") return <FocusMode onExit={onExit} />;
  return null;
}
        