"use client";

import { useState } from "react";
import { Mode, ModeOverlay } from "@/components/ModeOverlay";

export default function Home() {
  const [mode, setMode] = useState<Mode>(null);

  return (
    <main className="min-h-screen px-8 md:px-14 py-8 bg-slate-950 text-slate-50 relative">
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

        {/* Top-right cluster: Build + Inspect */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <button
            onClick={() => setMode("build")}
            className="text-[9px] text-sky-400/85 hover:text-sky-300 border border-sky-500/40 hover:border-sky-400 rounded-full px-3 py-1 transition-all"
          >
            Build ▸
          </button>
          <button
            onClick={() => setMode("chaos")}
            className="text-[8px] text-pink-400/80 hover:text-pink-300 transition-all"
          >
            Don&apos;t click
          </button>
        </div>
      </header>

      {/* Hero / About */}
      <section id="about" className="max-w-4xl flex flex-col gap-4 mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 leading-tight">
          I design and build interfaces that work like real products—clear, reliable, and thoughtfully engineered.
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl">
          I&apos;m a product-minded developer who cares about clean structure, honest UX,
          and small details that make people feel considered.
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
              Guided journaling with AI prompts and exportable insights.
              Built with Next.js, Supabase, and a privacy-conscious flow.
            </p>
            <p className="text-[10px] text-slate-500">
              Focus: UX systems, auth, structured data.
            </p>
          </div>

          {/* FutureMe */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
            <p className="text-xs text-emerald-300 font-medium mb-1">
              FutureMe — Minimalist Reflection App
            </p>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Lightweight daily journaling for focus & habit, tuned for speed.
            </p>
            <p className="text-[10px] text-slate-500">
              Focus: performance, minimal UI, interaction polish.
            </p>
          </div>

          {/* Reserved slots */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-xs text-slate-300 font-medium mb-1">
              Engineering • Integrations
            </p>
            <p className="text-[11px] text-slate-500">
              Placeholder for API work, backend logic, or infra supporting real users.
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

      {/* Contact */}
      <section id="contact" className="max-w-4xl mb-10">
        <p className="text-[11px] text-slate-500 mb-2">
          Open to software engineering, technical product, and thoughtful interaction roles.
        </p>
        <a
          href="mailto:tugcesimsek.king@gmail.com"
          className="inline-flex items-center px-5 py-2 rounded-full border border-slate-600 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.22)] transition-all"
        >
          Contact
        </a>
      </section>

      {/* Bottom-left: about:system */}
      <button
        onClick={() => setMode("system")}
        className="fixed bottom-5 left-6 text-[8px] text-slate-600 hover:text-slate-200 border border-slate-700/70 hover:border-slate-300 rounded-full px-3 py-1 bg-slate-950/80 backdrop-blur-sm transition-all"
      >
        about:system
      </button>

      {/* Bottom-right: Playground */}
      <button
        onClick={() => setMode("play")}
        className="fixed bottom-5 right-6 text-[8px] text-slate-500 hover:text-emerald-300 bg-slate-950/80 border border-slate-700/70 hover:border-emerald-400/70 rounded-full px-3 py-1 backdrop-blur-sm transition-all"
      >
        Playground ▸
      </button>

      {/* Overlay portal */}
      <ModeOverlay mode={mode} onClose={() => setMode(null)} />
    </main>
  );
}
