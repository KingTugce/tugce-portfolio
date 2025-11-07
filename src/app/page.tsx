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
            Software • Product • Playful Systems
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

        {/* Subtle secret hook */}
        <div className="flex items-center">
          <button
            className="text-[9px] text-slate-500 hover:text-amber-300 border border-transparent hover:border-amber-400/70 rounded-full px-3 py-1 transition-all"
          >
            ⚠️ Don&apos;t click
          </button>
        </div>
      </header>

      {/* Hero / About */}
      <section id="about" className="max-w-4xl flex flex-col gap-4 mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 leading-tight">
          I design & build interfaces that behave like products,
          not static pages.
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl">
          I&apos;m a self-taught software developer and product-minded builder
          who blends clean engineering with subtle game mechanics:
          focused UX, hidden depth, and systems that feel alive without
          losing clarity or performance.
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
              Guided journaling experience with AI prompts, emotional tagging,
              and exportable insights. Built with Next.js, Supabase auth, and a
              clean privacy-first architecture.
            </p>
            <p className="text-[10px] text-slate-500">
              Focus: UX systems, data modeling, secure flows.
            </p>
          </div>

          {/* FutureMe */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
            <p className="text-xs text-emerald-300 font-medium mb-1">
              FutureMe — Minimalist Reflection App
            </p>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Lightweight journaling tool designed for speed and daily habit,
              with a focus on simplicity, fast load, and frictionless input.
            </p>
            <p className="text-[10px] text-slate-500">
              Focus: front-end craft, micro-interactions, performance.
            </p>
          </div>

          {/* Placeholder: more coding projects */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-xs text-slate-300 font-medium mb-1">
              Project Slot — Add your next build
            </p>
            <p className="text-[11px] text-slate-500">
              This tile is reserved for another shipped project:
              API integrations, dashboards, multiplayer ideas, or
              whatever proves your range.
            </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-xs text-slate-300 font-medium mb-1">
              Project Slot — Systems & Automation
            </p>
            <p className="text-[11px] text-slate-500">
              Use this space to highlight a script, internal tool,
              or automation that shows your ability to think like an
              engineer inside a real product environment.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-4xl mb-10">
        <p className="text-[11px] text-slate-500 mb-2">
          Open to software engineering, technical product, and creative
          interaction roles.
        </p>
        <a
          href="mailto:tugcesimsek.king@gmail.com"
          className="inline-flex items-center px-5 py-2 rounded-full border border-slate-600 text-[11px] text-slate-200 hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_0_18px_rgba(251,191,36,0.22)] transition-all"
        >
          Contact
        </a>
      </section>

      {/* Play hook — subtle bottom-right */}
      <button
        className="fixed bottom-5 right-6 text-[9px] text-slate-500 hover:text-emerald-300 bg-slate-950/70 border border-slate-700/60 hover:border-emerald-400/70 rounded-full px-3 py-1 backdrop-blur-sm transition-all"
      >
        Play ▸
      </button>
    </main>
  );
}
