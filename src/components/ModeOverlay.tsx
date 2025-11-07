"use client";

export type Mode = "play" | "build" | "inspect" | "system" | "focus" | null;

interface ModeOverlayProps {
  mode: Mode;
  onClose: () => void;
}

const baseOverlay =
  "fixed inset-0 z-40 bg-slate-950/96 backdrop-blur-xl flex flex-col items-center justify-center gap-4 px-6";

export function ModeOverlay({ mode, onClose }: ModeOverlayProps) {
  if (!mode) return null;

  if (mode === "play") {
    return (
      <div className={baseOverlay}>
        <p className="text-[9px] uppercase tracking-[0.24em] text-emerald-400">
          Playground Layer
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-50 text-center">
          Interfaces as systems you can explore.
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-md text-center">
          This space is for small mechanics and experiments that test how people move,
          decide, and engage. Every interaction here is a prototype for better product behavior.
        </p>
        <CloseButton onClose={onClose} />
      </div>
    );
  }

  if (mode === "build") {
    return (
      <div className={baseOverlay}>
        <p className="text-[9px] uppercase tracking-[0.24em] text-sky-400">
          Build Mode
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-50 text-center">
          Under the hood, this is built like a real product.
        </h2>
        <ul className="text-[10px] md:text-xs text-slate-400 max-w-md space-y-1.5">
          <li>• Next.js App Router for a scalable, file-based structure.</li>
          <li>• TypeScript-ready components for predictable behavior.</li>
          <li>• Tailwind for consistent, low-friction iteration.</li>
          <li>• Single overlay system driven by a typed <code>mode</code> state.</li>
        </ul>
        <p className="text-[10px] text-slate-500 max-w-md text-center">
          This is the same discipline I apply to production code: small surfaces, clear
          contracts, no unnecessary cleverness.
        </p>
        <CloseButton onClose={onClose} />
      </div>
    );
  }

  if (mode === "inspect") {
    return (
      <div className={baseOverlay}>
        <p className="text-[9px] uppercase tracking-[0.24em] text-amber-400">
          Inspect Layer
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-50 text-center">
          How this portfolio is wired.
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-md text-center">
          Each interactive entry point maps to a single overlay controller. No duplicated logic,
          no ad-hoc modals. The goal is clarity: anyone reading the code should understand it in minutes.
        </p>
        <CloseButton onClose={onClose} />
      </div>
    );
  }

  if (mode === "system") {
    return (
      <div className={baseOverlay}>
        <p className="text-[9px] uppercase tracking-[0.24em] text-slate-500">
          about:system
        </p>
        <div className="w-full max-w-md bg-slate-950/80 border border-slate-700 rounded-xl p-4 font-mono text-[10px] text-slate-300">
          <p>tugce@portfolio:~$ whoami</p>
          <p>&gt; builder / developer / product-thinker</p>
          <p>&gt; shipped 100+ experiments, tools, and interfaces</p>
          <p>&gt; cares about clarity, behavior, and long-term systems</p>
          <p className="mt-2">tugce@portfolio:~$ philosophy</p>
          <p>&gt; design quietly, engineer seriously, hide the fun in plain sight.</p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
    );
  }

  if (mode === "focus") {
    return (
      <div className={baseOverlay}>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-50 text-center">
          Focus mode.
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-md text-center">
          A reminder that the best products are simple at first glance. All the complexity
          is managed behind the scenes.
        </p>
        <CloseButton onClose={onClose} />
      </div>
    );
  }

  return null;
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="mt-3 px-4 py-2 rounded-full border border-slate-600 text-[10px] text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition-all"
    >
      Back to portfolio
    </button>
  );
}
