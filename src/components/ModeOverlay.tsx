"use client";

export type Mode = "play" | "build" | "inspect" | "system" | "focus" | null;

interface ModeOverlayProps {
  mode: Mode;
  onClose: () => void;
}

const baseOverlay =
  "fixed inset-0 z-40 bg-slate-950/96 backdrop-blur-xl flex items-center justify-center px-6";

export function ModeOverlay({ mode, onClose }: ModeOverlayProps) {
  if (!mode) return null;

  // Click on dark background closes overlay
  const handleBackdropClick = () => {
    onClose();
  };

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (mode === "play") {
    // Simple, smart mini-game:
    // “Choose the behavior that matches how I build products.”
    const options = ["Confusing & flashy", "Clear & responsive", "Random & noisy"];

    return (
      <div className={baseOverlay} onClick={handleBackdropClick}>
        <div
          onClick={stop}
          className="w-full max-w-md bg-slate-950/98 border border-emerald-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 shadow-[0_0_40px_rgba(16,185,129,0.18)]"
        >
          <p className="text-[9px] uppercase tracking-[0.24em] text-emerald-400">
            Playground Layer
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-50 text-center">
            Pick how this portfolio is designed to behave.
          </h2>
          <p className="text-[10px] md:text-xs text-slate-400 text-center mb-1">
            One of these is right. The others are how I don&apos;t build.
          </p>

          <div className="flex flex-col gap-2 w-full">
            {options.map((label) => (
              <button
                key={label}
                onClick={(e) => {
                  e.stopPropagation();
                  if (label === "Clear & responsive") {
                    alert("Exactly. That’s the principle behind everything here.");
                  } else {
                    alert("Not my style. Try again.");
                  }
                }}
                className="w-full text-[10px] md:text-xs px-3 py-2 rounded-full border border-slate-700 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 transition-all text-left"
              >
                {label}
              </button>
            ))}
          </div>

          <OverlayCloseHint onClose={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "build") {
    return (
      <div className={baseOverlay} onClick={handleBackdropClick}>
        <div
          onClick={stop}
          className="w-full max-w-md bg-slate-950/98 border border-sky-500/30 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_0_40px_rgba(56,189,248,0.18)]"
        >
          <p className="text-[9px] uppercase tracking-[0.24em] text-sky-400">
            Build Mode
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-50">
            Under the hood, this is structured like a product.
          </h2>
          <ul className="text-[9px] md:text-[10px] text-slate-400 space-y-1.5">
            <li>• Next.js App Router for scalable, predictable routing.</li>
            <li>• Typed <code>mode</code> state controlling all overlays from one place.</li>
            <li>• Tailwind for consistent, maintainable visual language.</li>
            <li>• Clear separation between layout, content, and interactive layers.</li>
          </ul>
          <p className="text-[9px] text-slate-500">
            Same habits I bring to real teams: no hidden chaos, no cleverness that future
            engineers would hate.
          </p>

          <OverlayCloseHint onClose={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "inspect") {
    return (
      <div className={baseOverlay} onClick={handleBackdropClick}>
        <div
          onClick={stop}
          className="w-full max-w-md bg-slate-950/98 border border-amber-500/30 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_0_40px_rgba(245,158,11,0.18)] font-mono"
        >
          <p className="text-[9px] uppercase tracking-[0.24em] text-amber-400">
            Inspect Layer
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-50">
            Readable by humans. Extendable by teams.
          </h2>
          <p className="text-[9px] text-slate-400">
            Interaction is driven by a single overlay component:
          </p>
          <pre className="text-[8px] bg-slate-900/80 p-2 rounded-lg text-slate-300 overflow-x-auto">
{`const [mode, setMode] = useState<Mode>(null);

// Triggers:
<button onClick={() => setMode("build")}>Build</button>

// Overlay:
<ModeOverlay mode={mode} onClose={() => setMode(null)} />`}
          </pre>
          <p className="text-[9px] text-slate-500">
            No magic, no tangled state. Anyone on a team can follow this in seconds.
          </p>

          <OverlayCloseHint onClose={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "system") {
    return (
      <div className={baseOverlay} onClick={handleBackdropClick}>
        <div
          onClick={stop}
          className="w-full max-w-md bg-slate-950/98 border border-slate-600/60 rounded-2xl p-5 flex flex-col gap-2 font-mono text-[9px] text-slate-300"
        >
          <p className="text-[9px] uppercase tracking-[0.24em] text-slate-500">
            about:system
          </p>
          <p>tugce@portfolio:~$ whoami</p>
          <p>&gt; builder / developer / product thinker</p>
          <p>&gt; 100+ experiments across apps, tools, flows</p>
          <p>&gt; sees products as systems, not screens</p>
          <p className="mt-2">tugce@portfolio:~$ values</p>
          <p>&gt; clarity, longevity, intentional fun.</p>

          <OverlayCloseHint onClose={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "focus") {
    return (
      <div className={baseOverlay} onClick={handleBackdropClick}>
        <div
          onClick={stop}
          className="max-w-md text-center flex flex-col gap-3"
        >
          <h2 className="text-lg md:text-xl font-semibold text-slate-50">
            Focus mode.
          </h2>
          <p className="text-[10px] text-slate-400">
            A reminder that good products are calm on the surface and organized underneath.
          </p>
          <OverlayCloseHint onClose={onClose} />
        </div>
      </div>
    );
  }

  return null;
}

function OverlayCloseHint({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 mt-3">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-full border border-slate-600 text-[9px] text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition-all"
      >
        Back to portfolio
      </button>
      <p className="text-[7px] text-slate-500">
        Click outside this card to return as well.
      </p>
    </div>
  );
}
