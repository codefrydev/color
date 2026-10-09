'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { StudioState } from '../../core/engine/types';
import { DEFAULT_STUDIO_STATE } from '../../state/StudioContext';
import { deriveDesignSystem } from '../../core/engine/derivation';
import {
  getBroadcastChannel,
  readPersistedStudioState,
  broadcastStudioState,
  STORAGE_KEY,
} from '../../state/crossTabSync';
import { decodeStateFromHash } from '../../state/urlSync';
import {
  PreviewSidebar,
  TemplateId,
} from '../../components/preview/PreviewSidebar';
import { SaaSDashboard } from '../../components/templates/SaaSDashboard';
import { ECommerceStore } from '../../components/templates/ECommerceStore';
import { DevDocsPortal } from '../../components/templates/DevDocsPortal';
import { LandingHero } from '../../components/templates/LandingHero';
import { MobileAppShell } from '../../components/templates/MobileAppShell';

function PreviewClient() {
  const [state, setState] = useState<StudioState>(DEFAULT_STUDIO_STATE);
  const [template, setTemplate] = useState<TemplateId>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [inspectedToken, setInspectedToken] = useState<{
    prop: string;
    bg: string;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  // Initialize from hash or storage or URL query
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check query params for template
    const params = new URLSearchParams(window.location.search);
    const tmplParam = params.get('template') as TemplateId;
    if (
      tmplParam &&
      ['dashboard', 'ecommerce', 'docs', 'landing', 'mobile'].includes(tmplParam)
    ) {
      setTemplate(tmplParam);
    }

    // Check hash first
    const fromHash = decodeStateFromHash(window.location.hash);
    if (fromHash) {
      setState((prev) => ({ ...prev, ...fromHash }));
      return;
    }

    // Check localStorage
    const fromStorage = readPersistedStudioState();
    if (fromStorage) {
      setState(fromStorage);
    }
  }, []);

  // Listen to BroadcastChannel and Storage events for live updates from Studio
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = getBroadcastChannel();
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'STATE_UPDATE' && e.data.payload) {
        setState(e.data.payload);
        setIsSynced(true);
      }
    };

    if (channel) {
      channel.addEventListener('message', handleMessage);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(parsed);
          setIsSynced(true);
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) {
        channel.removeEventListener('message', handleMessage);
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Compute and apply CSS variables to document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const derived = deriveDesignSystem(state, state.theme);
    const root = document.documentElement;

    document.body.setAttribute('data-theme', state.theme);

    Object.entries(derived.vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
    root.style.setProperty(
      '--leading-tight-px',
      derived.tokens['--leading-tight'] || '1.2'
    );
  }, [state]);

  // Two-way state updater (updates preview and broadcasts back to studio)
  const updateStudioState = useCallback(
    (updater: (prev: StudioState) => StudioState) => {
      setState((prev) => {
        const next = updater(prev);
        broadcastStudioState(next);
        return next;
      });
    },
    []
  );

  // Inspect mode hover handler
  useEffect(() => {
    if (!inspectMode) {
      setInspectedToken(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.closest('aside') ||
        target.closest('[data-inspect-ignore]')
      ) {
        return;
      }

      const style = window.getComputedStyle(target);
      setInspectedToken({
        prop: target.tagName.toLowerCase(),
        bg: style.backgroundColor,
        color: style.color,
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [inspectMode]);

  const toggleTheme = () => {
    updateStudioState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-app">
      {/* Fixed Left Sidebar Panel */}
      <PreviewSidebar
        currentTemplate={template}
        onChangeTemplate={setTemplate}
        theme={state.theme}
        onToggleTheme={toggleTheme}
        isSynced={isSynced}
        inspectMode={inspectMode}
        onToggleInspect={() => setInspectMode(!inspectMode)}
        state={state}
        onUpdateState={updateStudioState}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 100% Dedicated Full-Page Preview Area with Independent Scroll */}
      <main className="flex-1 h-screen overflow-y-auto bg-app relative">
        {template === 'mobile' ? (
          <div className="min-h-full py-10 px-4 flex items-center justify-center bg-app">
            {/* Photorealistic Smartphone Frame */}
            <div className="w-[390px] h-[844px] rounded-[52px] bg-surface bd shadow-2xl overflow-hidden flex flex-col relative ring-12 ring-slate-900/90 dark:ring-slate-800 shadow-slate-950/40 flex-shrink-0">
              {/* Dynamic Island Pill */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-40 flex items-center justify-end px-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 flex-shrink-0" />
              </div>

              {/* In-App Screen Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-surface pt-7">
                <MobileAppShell />
              </div>

              {/* iOS Home Bar */}
              <div className="h-5 flex items-center justify-center bg-surface flex-shrink-0">
                <div className="w-32 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-full">
            {template === 'dashboard' && <SaaSDashboard />}
            {template === 'ecommerce' && <ECommerceStore />}
            {template === 'docs' && <DevDocsPortal />}
            {template === 'landing' && <LandingHero />}
          </div>
        )}
      </main>

      {/* Floating Inspect HUD Tooltip */}
      {inspectMode && inspectedToken && (
        <div
          data-inspect-ignore="true"
          className="fixed pointer-events-none z-50 px-3 py-2 rounded-xl bg-slate-950/95 text-white font-mono text-[11px] shadow-2xl border border-slate-700/60 backdrop-blur-md animate-in fade-in-50 duration-75 space-y-1"
          style={{
            left: Math.min(window.innerWidth - 280, inspectedToken.x + 16),
            top: Math.min(window.innerHeight - 90, inspectedToken.y + 16),
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
            <span className="font-bold text-[var(--p-400)]">
              &lt;{inspectedToken.prop}&gt;
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">
              Computed Styles
            </span>
          </div>
          <div className="text-[10px] space-y-0.5 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">bg:</span>
              <span className="text-slate-200 truncate max-w-[200px]">
                {inspectedToken.bg}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">color:</span>
              <span className="text-slate-200 truncate max-w-[200px]">
                {inspectedToken.color}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 bg-app font-mono text-xs t-muted">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ background: 'var(--p-500)' }}
            />
            <span>Loading Dedicated Preview Canvas...</span>
          </div>
        </div>
      }
    >
      <PreviewClient />
    </Suspense>
  );
}
