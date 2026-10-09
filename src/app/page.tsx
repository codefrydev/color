'use client';

import React, { useState, useEffect } from 'react';
import { StudioProvider } from '../state/StudioContext';
import { Header } from '../components/header/Header';
import { GeneratorHero } from '../components/generator/GeneratorHero';
import { TuningPanel } from '../components/controls/TuningPanel';
import { ScaleExplorer } from '../components/scales/ScaleExplorer';
import { AccessibilityMatrix } from '../components/a11y/AccessibilityMatrix';
import { DerivationPipeline } from '../components/pipeline/DerivationPipeline';
import { ImageColorExtractor } from '../components/image-picker/ImageColorExtractor';
import { MiniDashboardPreview } from '../components/preview/MiniDashboardPreview';
import { ExportModal } from '../components/export/ExportModal';
import {
  LayoutDashboard,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Workflow,
  Image,
  ExternalLink,
} from 'lucide-react';

const SECTIONS = [
  { id: 'sec-preview', label: 'Preview', icon: LayoutDashboard },
  { id: 'sec-scales', label: 'Scales 50–950', icon: Palette },
  { id: 'sec-a11y', label: 'Accessibility', icon: ShieldCheck },
  { id: 'sec-tokens', label: 'Design Tokens', icon: SlidersHorizontal },
  { id: 'sec-pipeline', label: 'Pipeline', icon: Workflow },
  { id: 'sec-extractor', label: 'Image Extractor', icon: Image },
];

function StudioContent() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-preview');

  // Track active section on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SECTIONS[i].id);
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openPreview = () => {
    if (typeof window === 'undefined') return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.open(`${base}/preview/?template=dashboard${window.location.hash}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-app">
      {/* Top Single-Line Header */}
      <Header onOpenExport={() => setIsExportOpen(true)} />

      {/* Main Studio Body: 2-Column Responsive Sticky Workbench */}
      <div className="max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-7 flex flex-col lg:flex-row gap-5 lg:gap-7 items-start">
        {/* Left Column: Sticky Control Rail */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto no-scrollbar space-y-4">
          <GeneratorHero />
        </aside>

        {/* Right Column: Scrolling Canvas & Analysis Studio */}
        <main className="flex-1 min-w-0 space-y-7">
          {/* Sticky Section Navigation Anchor Rail */}
          <div className="sticky top-16 z-20 bg-surface/95 backdrop-blur-md bd rounded-xl p-1.5 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-app t-primary shadow-xs ring-1 ring-[var(--border-default)]'
                        : 't-secondary hover:t-primary hover:bg-app/60'
                    }`}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{
                        color: isActive ? 'var(--p-500)' : 'currentColor',
                      }}
                    />
                    <span>{s.label}</span>
                  </a>
                );
              })}
            </nav>

            <button
              onClick={openPreview}
              className="btn btn-secondary btn-sm h-7 px-2.5 text-xs font-semibold hidden md:flex items-center gap-1.5 flex-shrink-0 ml-auto"
              title="Open full interactive preview studio in new tab"
            >
              <span>Full Preview</span>
              <ExternalLink className="w-3 h-3 text-[var(--p-500)]" />
            </button>
          </div>

          {/* Section 1: Live Real-World Preview Sandbox */}
          <section id="sec-preview" className="space-y-3">
            <MiniDashboardPreview />
          </section>

          {/* Section 2: Complete Palette Scales (50–950) */}
          <section id="sec-scales" className="space-y-3">
            <ScaleExplorer />
          </section>

          {/* Section 3: Accessibility & Color Blindness Studio */}
          <section id="sec-a11y" className="space-y-3">
            <AccessibilityMatrix />
          </section>

          {/* Section 4: Harmonic Tuning & Design Tokens */}
          <section id="sec-tokens" className="space-y-3">
            <TuningPanel />
          </section>

          {/* Section 5: Mathematical Derivation Pipeline */}
          <section id="sec-pipeline" className="space-y-3">
            <DerivationPipeline />
          </section>

          {/* Section 6: Image Brand Color Extractor */}
          <section id="sec-extractor" className="space-y-3">
            <ImageColorExtractor />
          </section>
        </main>
      </div>

      {/* Export Code Modal Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <StudioProvider>
      <StudioContent />
    </StudioProvider>
  );
}
