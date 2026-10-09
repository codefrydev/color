'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Sparkles,
  Smartphone,
  Sun,
  Moon,
  ArrowLeft,
  Inspect,
  Copy,
  Check,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { StudioState, STOPS } from '../../core/engine/types';
import { deriveDesignSystem } from '../../core/engine/derivation';
import { hslToHex, mod } from '../../core/color/conversions';
import { exportCss } from '../../core/exporters/css';
import { CodefrydevLogo } from '../brand/CodefrydevLogo';

export type TemplateId =
  | 'dashboard'
  | 'ecommerce'
  | 'docs'
  | 'landing'
  | 'mobile';

interface PreviewSidebarProps {
  currentTemplate: TemplateId;
  onChangeTemplate: (t: TemplateId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isSynced: boolean;
  inspectMode: boolean;
  onToggleInspect: () => void;
  state: StudioState;
  onUpdateState: (fn: (prev: StudioState) => StudioState) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function PreviewSidebar({
  currentTemplate,
  onChangeTemplate,
  theme,
  onToggleTheme,
  isSynced,
  inspectMode,
  onToggleInspect,
  state,
  onUpdateState,
  isCollapsed,
  onToggleCollapse,
}: PreviewSidebarProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const derived = deriveDesignSystem(state, theme);

  const templates: {
    id: TemplateId;
    label: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'dashboard',
      label: 'SaaS Dashboard',
      description: 'Analytics, revenue & metrics',
      icon: LayoutDashboard,
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce Store',
      description: 'Product catalog & cart',
      icon: ShoppingBag,
    },
    {
      id: 'docs',
      label: 'Developer Docs',
      description: 'API reference & syntax',
      icon: BookOpen,
    },
    {
      id: 'landing',
      label: 'Landing & Pricing',
      description: 'High-converting marketing',
      icon: Sparkles,
    },
    {
      id: 'mobile',
      label: 'Mobile App',
      description: 'iOS / Android feed shell',
      icon: Smartphone,
    },
  ];

  const handleCopyCss = () => {
    const css = exportCss(state);
    navigator.clipboard.writeText(css);
    setCopiedToken('css-vars');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleCopyHex = (hex: string, label: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const nudgeHue = (delta: number) => {
    onUpdateState((prev) => ({
      ...prev,
      h: Math.round(mod(prev.h + delta)),
    }));
  };

  const randomizePalette = () => {
    onUpdateState((prev) => ({
      ...prev,
      h: Math.floor(Math.random() * 360),
      s: Math.floor(65 + Math.random() * 25),
      l: Math.floor(45 + Math.random() * 15),
    }));
  };

  const contrastRatio = derived.meta.picks.btn?.ratio || 4.5;
  const contrastLevel =
    contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : 'AA Large';

  if (isCollapsed) {
    return (
      <aside className="w-14 flex-shrink-0 h-screen bg-surface bd-r flex flex-col items-center justify-between py-3 z-30 transition-all duration-200">
        <div className="flex flex-col items-center gap-3">
          <a
            href="../"
            className="btn btn-ghost btn-sm h-9 w-9 !p-0 t-secondary hover:t-primary flex items-center justify-center text-[var(--p-500)]"
            title="Return to Color Studio editor"
          >
            <CodefrydevLogo className="w-5 h-5" />
          </a>

          <button
            onClick={onToggleCollapse}
            className="btn btn-secondary btn-sm h-8 w-8 !p-0"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-6 h-[1px] bg-[var(--border-default)] my-1" />

          {/* Collapsed template icon buttons */}
          <div className="flex flex-col gap-1.5">
            {templates.map((t) => {
              const Icon = t.icon;
              const isActive = currentTemplate === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChangeTemplate(t.id)}
                  className={`btn btn-sm h-9 w-9 !p-0 rounded-lg transition-all ${
                    isActive
                      ? 'btn-primary shadow-xs'
                      : 'btn-ghost t-secondary hover:t-primary'
                  }`}
                  title={t.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsed Bottom Actions */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="btn btn-ghost btn-sm h-8 w-8 !p-0"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 t-secondary" />
            )}
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 xl:w-72 flex-shrink-0 h-screen bg-surface bd-r flex flex-col justify-between z-30 select-none shadow-sm transition-all duration-200">
      {/* Top Header & Back to Studio */}
      <div className="p-4 bd-b space-y-3">
        <div className="flex items-center justify-between">
          <a
            href="../"
            className="btn btn-secondary btn-sm h-8 px-2.5 text-xs font-semibold gap-2"
            title="Return to Color Studio editor"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1.5">
              <CodefrydevLogo className="w-4 h-4 text-[var(--p-500)]" />
              <span>Color Studio</span>
            </div>
          </a>

          <button
            onClick={onToggleCollapse}
            className="btn btn-ghost btn-sm h-8 w-8 !p-0 t-muted hover:t-primary"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Live Sync Badge & Contrast Info */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            title="Listening to live updates from Color Studio"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isSynced ? 'Live Synced' : 'Sync Active'}</span>
          </div>

          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-app bd t-secondary font-semibold">
            {contrastLevel} {contrastRatio.toFixed(1)}:1
          </span>
        </div>
      </div>

      {/* Template Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider t-muted block px-2 mb-1.5">
            Preview Templates
          </span>
          <nav className="space-y-1">
            {templates.map((t) => {
              const Icon = t.icon;
              const isActive = currentTemplate === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChangeTemplate(t.id)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] shadow-xs ring-1 ring-[var(--p-500)]/30 font-semibold'
                      : 't-secondary hover:t-primary hover:bg-app'
                  }`}
                >
                  <Icon
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{
                      color: isActive ? 'var(--p-500)' : 'currentColor',
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold block leading-tight">
                      {t.label}
                    </span>
                    <span className="text-[10px] opacity-75 block truncate mt-0.5">
                      {t.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Palette HUD */}
        <div className="p-3 rounded-xl bg-app bd space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider t-muted">
              Active Palette
            </span>
            <span className="font-mono text-[10px] text-secondary">
              {state.h}°
            </span>
          </div>

          {/* Color swatch & Hex Code */}
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-lg shadow-xs flex-shrink-0 bd"
              style={{ background: derived.meta.hex }}
            />
            <span className="font-mono text-xs font-bold t-primary uppercase flex-1">
              {derived.meta.hex}
            </span>
            <button
              onClick={() => handleCopyHex(derived.meta.hex, 'base-hex')}
              className="btn btn-ghost btn-sm h-6 w-6 !p-0 t-muted hover:t-primary"
              title="Copy hex code"
            >
              {copiedToken === 'base-hex' ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Micro Primary scale ribbon */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-wider t-muted block">
              Primary 50–950
            </span>
            <div className="flex rounded-md overflow-hidden bd shadow-2xs h-3.5">
              {STOPS.map((stop) => {
                const hex = hslToHex(derived.scales.p[stop]);
                return (
                  <span
                    key={stop}
                    className="flex-1 transition-transform hover:scale-125 hover:z-10 cursor-pointer"
                    style={{ background: hex }}
                    title={`p-${stop}: ${hex}`}
                    onClick={() => handleCopyHex(hex, `p-${stop}`)}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Hue Stepper Controls */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <button
              onClick={() => nudgeHue(-15)}
              className="btn btn-secondary btn-sm h-6 px-1.5 text-[10px] font-mono flex-1"
              title="Shift hue -15°"
            >
              -15°
            </button>
            <button
              onClick={randomizePalette}
              className="btn btn-secondary btn-sm h-6 px-2 text-[10px] font-semibold flex items-center justify-center gap-1 flex-1 text-[var(--p-500)]"
              title="Randomize hue"
            >
              <Shuffle className="w-2.5 h-2.5" />
              <span>Random</span>
            </button>
            <button
              onClick={() => nudgeHue(15)}
              className="btn btn-secondary btn-sm h-6 px-1.5 text-[10px] font-mono flex-1"
              title="Shift hue +15°"
            >
              +15°
            </button>
          </div>

          {/* Copy CSS Variables button */}
          <button
            onClick={handleCopyCss}
            className="w-full btn btn-secondary btn-sm h-7 text-[11px] font-semibold gap-1.5"
            title="Copy full CSS variables block"
          >
            {copiedToken === 'css-vars' ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  Copied CSS Vars!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-secondary" />
                <span>Copy CSS Tokens</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-3 bd-t space-y-2 bg-surface">
        <div className="flex items-center justify-between gap-2">
          {/* Inspect mode button */}
          <button
            onClick={onToggleInspect}
            className={`btn btn-sm h-8 flex-1 text-xs font-semibold gap-1.5 ${
              inspectMode
                ? 'btn-primary shadow-xs ring-2 ring-[var(--p-500)]/30'
                : 'btn-secondary'
            }`}
            title="Inspect computed token styles on hover"
          >
            <Inspect className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </button>

          {/* Theme mode toggle */}
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary btn-sm h-8 w-8 !p-0"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 t-secondary" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
