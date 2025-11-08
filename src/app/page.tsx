"use client";

import { useState } from "react";
import { ActiveMode, Mode } from "../components/GameModes";

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

        {/* Top-right: Play + Build */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <button
            onClick={() => setMode("play")}
            className="text-[9px] text-emerald-300/90 hover:text-emerald-300 border border-emerald-400/50 hover:border-emerald-300 rounded-full px-3 py-1 transition-all"
          >
            Play ▸
          </button>
          <button
            onClick={() => setMode("build")}
            className="text-[8px] text-sky-400/85 hover:text-sky-300 transition-all"
          >
            Build mode
          </button>
        </div>
      </header>

      {/* Hero / About */}
      <section id="about" className="max-w-4xl flex flex-col gap-4 mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 leading-tight">
          Design and engineering for interfaces that behave like real products:
          clear, reliable, and thoughtfully structured.
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl">
          Focus on systems that are easy to navigate, considerate to use, and
          quietly expressive in their details.
        </p>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-5xl space-y-4 mb-14">
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          Selected projects
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
            <p className="text-xs text-amber-300 font-medium mb-1">
              Clarity — AI-assisted reflection journal
            </p>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Guided journaling with structured prompts, sentiment-aware notes,
              and exportable insights. Next.js, Supabase, privacy-focused flows.
            </p>
            <p className="text-[10px] text-slate-500">
              Emphasis on information architecture, state handling, and trust.
            </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
            <p className="text-xs text-emerald-300 font-medium mb-1">
              FutureMe — minimalist daily logging
            </p>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Fast, distraction-free journaling surface tuned for repetition and ease.
            </p>
            <p className="text-[10px] text-slate-500">
              Emphasis on performance, typography, and micro-interactions.
            </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-xs text-slate-300 font-medium mb-1">
              Engineering • Integrations
            </p>
            <p className="text-[11px] text-slate-500">
              Slot reserved for API design, backend work, or messaging systems supporting real users.
            </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-xs text-slate-300 font-medium mb-1">
              Systems • Automation
            </p>
            <p className="text-[11px] text-slate-500">
              Slot reserved for internal tools and automation that compound time and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-4xl mb-10">
        <p className="text-[11px] text-slate-500 mb-2">
          Open to roles and collaborations where design, engineering, and systems thinking meet.
        </p>
        <a
          href="mailto:tugcesimsek.king@gmail.com"
          className="inline-flex items-center px-5 py-2 rounded-full border border-slate-600 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.22)] transition-all"
        >
          Contact
        </a>
      </section>

      {/* Bottom-left: Don’t click portal */}
      <button
        onClick={() => setMode("dontclick")}
        className="fixed bottom-5 left-6 text-[8px] text-pink-400/90 hover:text-pink-300 border border-pink-400/40 hover:border-pink-300 rounded-full px-3 py-1 bg-slate-950/85 backdrop-blur-sm transition-all"
      >
        Don&apos;t click
      </button>

      {/* Bottom-right: Focus portal */}
      <button
        onClick={() => setMode("focus")}
        className="fixed bottom-5 right-6 text-[8px] text-violet-300/90 hover:text-violet-200 border border-violet-400/40 hover:border-violet-300 rounded-full px-3 py-1 bg-slate-950/85 backdrop-blur-sm transition-all"
      >
        Focus
      </button>

      {/* Active game mode */}
      <ActiveMode mode={mode} onExit={() => setMode(null)} />
    </main>
  );
}
