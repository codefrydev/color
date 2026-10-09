'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Code2,
  Copy,
  Check,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export function DevDocsPortal() {
  const [copied, setCopied] = useState(false);

  const sampleCode = `import { createDesignSystem } from '@color/core';

// Initialize the mathematical harmonic solver
const tokens = createDesignSystem({
  base: '#6366f1',
  harmony: 'analogous',
  contrastTarget: 4.5,
  mode: 'oklch'
});

console.log(tokens.cssVariables);`;

  const copySnippet = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex bg-app">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface bd-r hidden md:flex flex-col justify-between p-4 min-h-full overflow-y-auto flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <BookOpen className="w-5 h-5 text-[var(--p-500)]" />
            <span className="font-bold text-sm t-primary">Core Documentation</span>
            <span className="badge b-info text-[10px] ml-auto">v2.4.0</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] t-muted block mb-2 px-2">
                Getting Started
              </span>
              <div className="space-y-1">
                <a
                  href="#overview"
                  className="block px-2.5 py-1.5 rounded-md font-semibold"
                  style={{
                    background: 'var(--nav-active-bg)',
                    color: 'var(--nav-active-text)',
                  }}
                >
                  Quickstart Guide
                </a>
                <a
                  href="#install"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  Installation & Setup
                </a>
                <a
                  href="#tokens"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  Design Token Architecture
                </a>
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] t-muted block mb-2 px-2">
                Color Science
              </span>
              <div className="space-y-1">
                <a
                  href="#oklch"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  OKLCH Perceptual Curves
                </a>
                <a
                  href="#apca"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  APCA vs WCAG 2.2
                </a>
                <a
                  href="#gamut"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  Display P3 Gamut Mapping
                </a>
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] t-muted block mb-2 px-2">
                Integration Guides
              </span>
              <div className="space-y-1">
                <a
                  href="#tailwind"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  Tailwind CSS v4 & v3
                </a>
                <a
                  href="#shadcn"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  Shadcn / Radix UI Themes
                </a>
                <a
                  href="#mobile"
                  className="block px-2.5 py-1.5 rounded-md t-secondary hover:bg-[var(--bg-surface-hover)]"
                >
                  SwiftUI & Jetpack Compose
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Documentation Article */}
      <main className="flex-1 max-w-4xl px-8 py-10 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs t-muted">
          <span>Docs</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Getting Started</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="t-primary font-semibold">Quickstart Guide</span>
        </div>

        {/* Article Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold t-primary tracking-tight">
            Color Design System Quickstart
          </h1>
          <p className="text-base t-secondary leading-relaxed">
            Generate perceptually balanced, accessible design tokens and inject them directly into your frontend build pipeline in seconds.
          </p>
        </div>

        {/* Callout: Info Alert */}
        <div className="p-4 rounded-xl b-info flex items-start gap-3 text-xs leading-relaxed">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Why OKLCH?</strong>
            Unlike HSL, where identical lightness values across different hues cause dramatic perceptual brightness swings, OKLCH guarantees consistent perceived luminance and contrast.
          </div>
        </div>

        {/* Code Block with Copy Action */}
        <div className="card !p-0 overflow-hidden shadow-md">
          <div className="px-4 py-2.5 bg-slate-900 text-slate-300 flex justify-between items-center text-xs bd-b">
            <span className="font-mono flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[var(--p-500)]" />
              quickstart.ts
            </span>
            <button
              onClick={copySnippet}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-slate-950 font-mono text-xs text-slate-100 overflow-x-auto">
            <pre>{sampleCode}</pre>
          </div>
        </div>

        {/* Callout: Warning Alert */}
        <div className="p-4 rounded-xl b-warning flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">WCAG 2.2 Contrast Floor</strong>
            Remember that small body text (under 18pt regular or 14pt bold) requires at least a 4.5:1 contrast ratio against the parent surface.
          </div>
        </div>

        {/* Callout: Success Alert */}
        <div className="p-4 rounded-xl b-success flex items-start gap-3 text-xs leading-relaxed">
          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Automatic Theme Regeneration</strong>
            Whenever you toggle dark mode, the engine re-computes optimal semantic stop assignments rather than simply inverting numbers.
          </div>
        </div>
      </main>
    </div>
  );
}
