"use client";

export default function Home() {
  return (
    <main className="min-h-screen px-8 md:px-14 py-8 bg-slate-950 text-slate-50">
      {/* Top navigation */}
      <header className="flex items-center justify-between gap-6 mb-16">
        {/* Brand */}
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
            Portfolio
          </span>
          <span className="text-sm font-semibold text-slate-100">
            Tugce S King
          </span>
          <span className="text-[10px] text-slate-500">
            Software • Product • Systems Thinking
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7 text-[10px] uppercase tracking-[0.16em] text-slate-400">
          <a href="#about" className="hover:text-slate-100 transition-colors">
            About
          </a>
          <a href="#projects" className="hover:text-slate-100 transition-colors">
            Projects
          </a>
          <a href="#experience" className="hover:text-slate-100 transition-colors">
            Experience
          </a>
          <a href="#contact" className="hover:text-slate-100 transition-colors">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero / About */}
      <section id="about" className="max-w-4xl flex flex-col gap-4 mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 leading-tight">
          I design and build interfaces that work like real products—clear,
          reliable, and thoughtfully engineered.
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl">
          I&apos;m a product-minded developer who values clean structure,
          purpose-driven design, and experiences that simply feel right to use.
        </p>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-5xl space-y-4 mb-14">
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          Selected Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Clarity */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
            <p className="text-xs text-amber-300 font-medium mb-1">
              Clarity — AI-Assisted Self-Therapy Journal
            </p>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Guided journaling with structured prompts, sentiment tagging, and
              exportable insights. Built with Next.js and a privacy-conscious flow.
            </p>
            <p className="text-[10px] text-slate-500">
              Focus: UX systems, data modeling, secure authentication.
            </p>
          </div>

          {/* FutureMe */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
            <p className="text-xs text-emerald-300 font-medium mb-1">
              FutureMe — Minimalist Reflection App
            </p>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Lightweight daily journaling focused on speed, clarity, and habit.
            </p>
            <p className="text-[10px] text-slate-500">
              Focus: performance, minimal UI, and micro-interactions.
            </p>
          </div>

          {/* Reserved slots */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-xs text-slate-300 font-medium mb-1">
              Engineering • Integrations
            </p>
            <p className="text-[11px] text-slate-500">
              Placeholder for API, backend, or infra work supporting real users.
            </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-xs text-slate-300 font-medium mb-1">
              Systems • Automation
            </p>
            <p className="text-[11px] text-slate-500">
              Placeholder for internal tools and automation that compound time.
            </p>
          </div>
        </div>
      </section>

      {/* Experience placeholder (we can flesh this out later) */}
      <section id="experience" className="max-w-4xl mb-10">
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide mb-2">
          Experience
        </h2>
        <p className="text-[11px] text-slate-500">
          To be filled with concise, relevant roles and responsibilities.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-4xl mb-10">
        <p className="text-[11px] text-slate-500 mb-2">
          Open to roles where design, engineering, and systems thinking meet.
        </p>
        <a
          href="mailto:tugcesimsek.king@gmail.com"
          className="inline-flex items-center px-5 py-2 rounded-full border border-slate-600 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.22)] transition-all"
        >
          Contact
        </a>
      </section>

      {/* Portal placeholders (no game logic yet) */}
      <button
        className="hidden md:flex fixed top-6 right-8 text-[9px] text-emerald-300/80 border border-emerald-400/40 rounded-full px-3 py-1 cursor-default"
      >
        Play
      </button>

      <button
        className="hidden md:flex fixed bottom-6 right-8 text-[9px] text-amber-300/80 border border-amber-400/40 rounded-full px-3 py-1 cursor-default"
      >
        Don&apos;t click
      </button>
    </main>
  );
}
