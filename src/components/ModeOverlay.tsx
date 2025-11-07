"use client";

export type Mode = "play" | "build" | "system" | "chaos" | null;

interface ModeOverlayProps {
  mode: Mode;
  onClose: () => void;
}

const baseOverlay =
  "fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center px-6";

export function ModeOverlay({ mode, onClose }: ModeOverlayProps) {
  if (!mode) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  const stop = (e: any) => {
    e.stopPropagation();
  };

  if (mode === "play") {
    // simple, kind mini-game: click floating orbs, no ego, just play
    const orbs = Array.from({ length: 7 });

    return (
      <div className={`${baseOverlay} animate-[fadeIn_0.2s_ease-out]`} onClick={handleBackdropClick}>
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div
          onClick={stop}
          className="relative w-full max-w-lg bg-slate-950/98 border border-emerald-500/30 rounded-3xl p-6 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.22)]"
        >
          <p className="text-[9px] uppercase tracking-[0.24em] text-emerald-400 mb-1">
            Playground
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-50">
            A tiny break for your brain.
          </h2>
          <p className="text-[10px] md:text-xs text-slate-400 mb-3">
            Hover or tap the orbs. They&apos;ll light up and fade. 
            No scoring, no pressure—just a reminder that interfaces can be kind.
          </p>

          <div className="relative h-40">
            {orbs.map((_, i) => (
              <button
                key={i}
                className="absolute w-6 h-6 rounded-full bg-emerald-500/20 hover:bg-emerald-400/70 hover:shadow-[0_0_18px_rgba(16,185,129,0.8)] transition-all"
                style={{
                  top: `${15 + (i * 11) % 70}%`,
                  left: `${8 + (i * 17) % 80}%`,
                  animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.15";
                }}
              />
            ))}
          </div>

          <OverlayClose onClose={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "chaos") {
    return (
      <div className={`${baseOverlay} animate-[fadeIn_0.18s_ease-out]`} onClick={handleBackdropClick}>
        <style jsx>{`
          @keyframes scan {
            0% { opacity: 0.1; }
            50% { opacity: 0.4; }
            100% { opacity: 0.1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div
          onClick={stop}
          className="w-full max-w-md bg-slate-950/98 border border-pink-500/40 rounded-3xl p-5 relative overflow-hidden shadow-[0_0_40px_rgba(236,72,153,0.35)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-pink-500/3 blur-3xl animate-[scan_2.2s_ease-in-out_infinite]" />
          <p className="text-[9px] uppercase tracking-[0.24em] text-pink-400 mb-1">
            You clicked it anyway.
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-50">
            Curiosity noted. That&apos;s the good kind of chaos.
          </h2>
          <p className="text-[10px] md:text-xs text-slate-400 mt-1">
            I like interfaces that reward exploration without punishing it.
            Thanks for testing the boundary.
          </p>

          <OverlayClose onClose={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "build") {
    return (
      <div className={baseOverlay} onClick={handleBackdropClick}>
        <div
          onClick={stop}
          className="w-full max-w-md bg-slate-950/98 border border-sky-500/40 rounded-3xl p-5 shadow-[0_0_32px_rgba(56,189,248,0.25)]"
        >
          <p className="text-[9px] uppercase tracking-[0.24em] text-sky-400 mb-1">
            Build mode
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-50">
            Structured like something a team can maintain.
          </h2>
          <ul className="text-[9px] md:text-[10px] text-slate-400 space-y-1.5 mt-2">
            <li>• Next.js App Router for predictable routing.</li>
            <li>• Single overlay controller using a typed <code>mode</code> state.</li>
            <li>• Tailwind for a consistent, minimal visual system.</li>
            <li>• Clear separation: content, layout, interaction layers.</li>
          </ul>
          <p className="text-[9px] text-slate-500 mt-2">
            In interviews I can walk through any of this code in detail.
          </p>

          <OverlayClose onClose={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "system") {
    return (
      <div className={baseOverlay} onClick={handleBackdropClick}>
        <div
          onClick={stop}
          className="w-full max-w-md bg-slate-950/98 border border-slate-600/70 rounded-2xl p-5 font-mono text-[9px] text-slate-300 shadow-[0_0_26px_rgba(148,163,253,0.18)]"
        >
          <p className="text-[9px] uppercase tracking-[0.24em] text-slate-500 mb-2">
            about:system
          </p>
          <p>tugce@portfolio:~$ whoami</p>
          <p>&gt; developer with a product brain</p>
          <p>&gt; shipped many small things, still curious</p>
          <p>&gt; likes honest UX, thoughtful systems, kind interactions</p>
          <p className="mt-2">tugce@portfolio:~$ note</p>
          <p>&gt; this space is here so you can see how I think, not to impress.</p>

          <OverlayClose onClose={onClose} />
        </div>
      </div>
    );
  }

  return null;
}

function OverlayClose({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 mt-4">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-full border border-slate-600 text-[9px] text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition-all"
      >
        Back to portfolio
      </button>
      <p className="text-[7px] text-slate-500">
        or click outside this card
      </p>
    </div>
  );
}
