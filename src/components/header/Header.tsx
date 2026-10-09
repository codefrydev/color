'use client';

import React, { useState } from 'react';
import { useStudio } from '../../state/StudioContext';
import { PRESETS } from '../../core/presets/presets';
import {
  ExternalLink,
  Sparkles,
  Undo2,
  Redo2,
  Sun,
  Moon,
  Share2,
  FileCode,
  Play,
  Pause,
  Palette,
  Check,
} from 'lucide-react';
import { CodefrydevLogo } from '../brand/CodefrydevLogo';

interface HeaderProps {
  onOpenExport: () => void;
}

export function Header({ onOpenExport }: HeaderProps) {
  const {
    state,
    randomize,
    undo,
    redo,
    canUndo,
    canRedo,
    setTheme,
    setScaleMode,
    applyPreset,
    live,
  } = useStudio();

  const [copiedShare, setCopiedShare] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const openPreview = () => {
    if (typeof window === 'undefined') return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.open(`${base}/preview/?template=dashboard${window.location.hash}`, '_blank');
  };

  return (
    <header className="h-16 px-4 lg:px-6 bg-surface bd-b flex items-center justify-between gap-3 sticky top-0 z-30 shadow-xs flex-shrink-0">
      {/* Brand & Title */}
      <a
        href="https://codefrydev.in"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 group"
        title="Visit codefrydev.in"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0 transition-transform group-hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--p-500), var(--a-500))',
          }}
        >
          <CodefrydevLogo className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm t-primary truncate flex items-center gap-2">
            <span>Color</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-app bd text-secondary font-semibold">
              by codefrydev
            </span>
          </div>
          <div className="text-[11px] t-muted hidden sm:flex items-center gap-1.5">
            <span
              className="chip-dot"
              style={{ background: 'var(--success-text)' }}
            />
            <span>codefrydev.in</span>
          </div>
        </div>
      </a>

      {/* Control Actions (Single Clean Row) */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Presets Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="btn btn-secondary btn-sm h-8 px-2.5"
            title="Curated presets"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--p-500)]" />
            <span className="hidden md:inline">Presets</span>
          </button>

          {showPresets && (
            <div className="absolute right-0 mt-2 w-64 card p-2 z-50 shadow-xl space-y-1 bg-surface bd">
              <span className="text-[10px] font-bold t-muted uppercase tracking-wider px-2 py-1 block">
                Curated Presets
              </span>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    applyPreset(p);
                    setShowPresets(false);
                  }}
                  className="w-full text-left p-2 rounded-md hover:bg-[var(--bg-surface-hover)] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-inner"
                    style={{ background: p.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold t-primary block leading-tight">
                      {p.name}
                    </span>
                    <span className="text-[10px] t-muted block truncate">
                      {p.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* OKLCH vs HSL pill */}
        <div className="hidden lg:flex items-center rounded-lg bd bg-app p-0.5 text-xs">
          <button
            onClick={() => setScaleMode('oklch')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              state.scaleMode === 'oklch'
                ? 'bg-surface text-primary shadow-xs font-bold'
                : 't-muted hover:t-primary'
            }`}
          >
            OKLCH
          </button>
          <button
            onClick={() => setScaleMode('hsl')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              state.scaleMode === 'hsl'
                ? 'bg-surface text-primary shadow-xs font-bold'
                : 't-muted hover:t-primary'
            }`}
          >
            HSL
          </button>
        </div>

        {/* Live Drift */}
        <button
          onClick={live.toggle}
          className={`btn btn-sm h-8 px-2.5 ${
            live.on ? 'btn-primary' : 'btn-secondary'
          }`}
          title={live.on ? 'Pause live animation' : 'Start live color drift'}
        >
          {live.on ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Live</span>
            </>
          )}
        </button>

        {/* Randomize (Space) */}
        <button
          onClick={() => randomize()}
          className="btn btn-secondary btn-sm h-8 px-2.5"
          title="Randomize harmonic system (Spacebar)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Randomize</span>
        </button>

        <div className="h-4 w-px bg-[var(--border-subtle)] hidden sm:block mx-0.5" />

        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className="btn btn-secondary btn-sm h-8 w-8 !p-0"
          title="Undo (Ctrl/Cmd + Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="btn btn-secondary btn-sm h-8 w-8 !p-0"
          title="Redo (Ctrl/Cmd + Shift + Z)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(state.theme === 'light' ? 'dark' : 'light')}
          className="btn btn-secondary btn-sm h-8 w-8 !p-0"
          title="Toggle Light / Dark mode"
        >
          {state.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="btn btn-secondary btn-sm h-8 hidden sm:inline-flex px-2.5"
          title="Copy shareable link with palette hash"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Share</span>
            </>
          )}
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="btn btn-secondary btn-sm h-8 px-2.5"
          title="Export design tokens"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Open in New Tab Button */}
        <button
          onClick={openPreview}
          className="btn btn-primary btn-sm h-8 px-3 font-semibold shadow-xs"
          title="Open real-world preview templates in new tab"
        >
          <span>Preview</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </header>
  );
}
