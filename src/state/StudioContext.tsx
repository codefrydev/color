'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { StudioState, DerivedSystem, ColorFormat, ScaleMode } from '../core/engine/types';
import { HarmonyMode } from '../core/engine/harmonies';
import { deriveDesignSystem } from '../core/engine/derivation';
import { broadcastStudioState, readPersistedStudioState } from './crossTabSync';
import { encodeStateToHash, decodeStateFromHash } from './urlSync';
import { PRESETS, PresetTheme } from '../core/presets/presets';

export const DEFAULT_STUDIO_STATE: StudioState = {
  h: 245,
  s: 78,
  l: 55,
  theme: 'light',
  harmony: 'analogous',
  format: 'hex',
  contrast: 4.5,
  scaleMode: 'oklch',

  satBoost: 1.0,
  accentShift: 0,
  neutralTint: 10,
  neutralHue: 0,
  semPull: 15,

  radius: 1.0,
  spacing: 1.0,
  shadow: 1.0,
  type: 1.0,
  leading: 1.45,

  locks: {
    primary: false,
    accent: false,
    neutral: false,
    semantic: false,
    tokens: false,
  },
};

interface HistoryEntry {
  snap: string;
  label: string;
  hex: string;
}

interface StudioContextType {
  state: StudioState;
  derived: DerivedSystem;
  setState: React.Dispatch<React.SetStateAction<StudioState>>;
  updateState: (partial: Partial<StudioState>, label?: string) => void;
  randomize: (section?: string) => void;
  regenSection: (section: 'primary' | 'accent' | 'neutral' | 'semantic' | 'tokens') => void;
  toggleLock: (key: keyof StudioState['locks']) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setHarmony: (harmony: HarmonyMode) => void;
  setFormat: (format: ColorFormat) => void;
  setScaleMode: (mode: ScaleMode) => void;
  applyPreset: (preset: PresetTheme) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyList: HistoryEntry[];
  historyIndex: number;
  restoreHistory: (index: number) => void;
  live: {
    on: boolean;
    mode: 'drift' | 'shuffle';
    speed: number;
    toggle: () => void;
    setMode: (mode: 'drift' | 'shuffle') => void;
    setSpeed: (speed: number) => void;
  };
}

const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudioState>(DEFAULT_STUDIO_STATE);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);
  const [liveOn, setLiveOn] = useState(false);
  const [liveMode, setLiveMode] = useState<'drift' | 'shuffle'>('drift');
  const [liveSpeed, setLiveSpeed] = useState(4);

  const derived = deriveDesignSystem(state, state.theme);

  // Apply CSS variables to root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    document.body.setAttribute('data-theme', state.theme);

    Object.entries(derived.vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
    root.style.setProperty(
      '--leading-tight-px',
      derived.tokens['--leading-tight'] || '1.2'
    );

    // Broadcast state for preview tabs
    broadcastStudioState(state);
  }, [state, derived]);

  // Load initial state from URL hash or storage or system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fromHash = decodeStateFromHash(window.location.hash);
    if (fromHash) {
      setState((prev) => ({
        ...prev,
        ...fromHash,
        locks: { ...prev.locks, ...(fromHash.locks || {}) },
      }));
      return;
    }

    const fromStorage = readPersistedStudioState();
    if (fromStorage) {
      setState(fromStorage);
      return;
    }

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setState((prev) => ({ ...prev, theme: 'dark' }));
    }
  }, []);

  // Sync hash when state changes (debounced)
  useEffect(() => {
    if (liveOn) return;
    const timer = setTimeout(() => {
      if (typeof window === 'undefined') return;
      const hash = '#' + encodeStateToHash(state);
      window.history.replaceState(null, '', hash);
    }, 400);
    return () => clearTimeout(timer);
  }, [state, liveOn]);

  // Push to history
  const pushHistoryRef = useRef<NodeJS.Timeout | null>(null);
  const pushHistory = useCallback((st: StudioState, label = 'Change') => {
    const snap = JSON.stringify(st);
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].snap === snap) {
        return prev;
      }
      const d = deriveDesignSystem(st, st.theme);
      const next = prev.slice(0, histIdx + 1);
      next.push({ snap, label, hex: d.meta.hex });
      if (next.length > 30) next.shift();
      return next;
    });
    setHistIdx((prev) => Math.min(prev + 1, 29));
  }, [histIdx]);

  const updateState = useCallback(
    (partial: Partial<StudioState>, label?: string) => {
      setState((prev) => {
        const next = { ...prev, ...partial };
        if (label && !liveOn) {
          if (pushHistoryRef.current) clearTimeout(pushHistoryRef.current);
          pushHistoryRef.current = setTimeout(() => {
            pushHistory(next, label);
          }, 350);
        }
        return next;
      });
    },
    [pushHistory, liveOn]
  );

  const toggleLock = useCallback((key: keyof StudioState['locks']) => {
    setState((prev) => ({
      ...prev,
      locks: {
        ...prev.locks,
        [key]: !prev.locks[key],
      },
    }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    updateState({ theme }, `Theme → ${theme}`);
  }, [updateState]);

  const setHarmony = useCallback((harmony: HarmonyMode) => {
    updateState({ harmony }, `Harmony → ${harmony}`);
  }, [updateState]);

  const setFormat = useCallback((format: ColorFormat) => {
    setState((prev) => ({ ...prev, format }));
  }, []);

  const setScaleMode = useCallback((scaleMode: ScaleMode) => {
    updateState({ scaleMode }, `Scale mode → ${scaleMode.toUpperCase()}`);
  }, [updateState]);

  const applyPreset = useCallback((preset: PresetTheme) => {
    updateState(preset.state, `Applied preset: ${preset.name}`);
  }, [updateState]);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...DEFAULT_STUDIO_STATE,
      theme: prev.theme,
    }));
  }, []);

  const regenSection = useCallback(
    (sec: 'primary' | 'accent' | 'neutral' | 'semantic' | 'tokens') => {
      setState((prev) => {
        const next = { ...prev };
        const rnd = (a: number, b: number) => a + Math.random() * (b - a);
        const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

        if (sec === 'primary') {
          next.h = Math.round(rnd(0, 360));
          const bias = (next.h > 40 && next.h < 75) ? -12 : (next.h > 340 || next.h < 20) ? 8 : 0;
          next.s = Math.round(clamp(rnd(55, 88) + bias, 40, 95));
          next.l = Math.round(rnd(46, 60));
        } else if (sec === 'accent') {
          const harmonies: HarmonyMode[] = [
            'analogous',
            'complementary',
            'triadic',
            'split',
            'tetradic',
            'square',
          ];
          next.harmony = harmonies[Math.floor(Math.random() * harmonies.length)];
          next.accentShift = Math.round(rnd(-30, 30));
        } else if (sec === 'neutral') {
          next.neutralTint = Math.round(rnd(3, 18));
          next.neutralHue = Math.round(rnd(-40, 40));
        } else if (sec === 'semantic') {
          next.semPull = Math.round(rnd(0, 60) / 5) * 5;
        } else if (sec === 'tokens') {
          next.radius = +rnd(0.4, 2).toFixed(1);
          next.spacing = +rnd(0.85, 1.35).toFixed(2);
          next.shadow = +rnd(0.4, 1.8).toFixed(1);
          next.type = +rnd(0.95, 1.15).toFixed(2);
          next.leading = +(Math.round(rnd(1.35, 1.7) / 0.05) * 0.05).toFixed(2);
        }
        return next;
      });
    },
    []
  );

  const randomize = useCallback((section?: string) => {
    setState((prev) => {
      const L = prev.locks;
      const next = { ...prev };
      const rnd = (a: number, b: number) => a + Math.random() * (b - a);
      const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

      if (!L.primary) {
        next.h = Math.round(rnd(0, 360));
        const bias = (next.h > 40 && next.h < 75) ? -12 : (next.h > 340 || next.h < 20) ? 8 : 0;
        next.s = Math.round(clamp(rnd(55, 88) + bias, 40, 95));
        next.l = Math.round(rnd(46, 60));
      }
      if (!L.accent) {
        const harmonies: HarmonyMode[] = [
          'analogous',
          'complementary',
          'triadic',
          'split',
          'tetradic',
          'square',
        ];
        next.harmony = harmonies[Math.floor(Math.random() * harmonies.length)];
        next.accentShift = Math.round(rnd(-25, 25));
      }
      if (!L.neutral) {
        next.neutralTint = Math.round(rnd(3, 18));
        next.neutralHue = Math.round(rnd(-40, 40));
      }
      if (!L.semantic) {
        next.semPull = Math.round(rnd(0, 60) / 5) * 5;
      }
      if (!L.tokens) {
        next.radius = +rnd(0.5, 1.8).toFixed(1);
        next.spacing = +rnd(0.9, 1.3).toFixed(2);
        next.shadow = +rnd(0.5, 1.6).toFixed(1);
        next.type = +rnd(0.97, 1.1).toFixed(2);
        next.leading = +(Math.round(rnd(1.35, 1.65) / 0.05) * 0.05).toFixed(2);
      }
      return next;
    });
  }, []);

  // Undo / Redo
  const undo = useCallback(() => {
    if (histIdx > 0 && history[histIdx - 1]) {
      const target = history[histIdx - 1];
      setHistIdx(histIdx - 1);
      setState(JSON.parse(target.snap));
    }
  }, [histIdx, history]);

  const redo = useCallback(() => {
    if (histIdx < history.length - 1 && history[histIdx + 1]) {
      const target = history[histIdx + 1];
      setHistIdx(histIdx + 1);
      setState(JSON.parse(target.snap));
    }
  }, [histIdx, history]);

  const restoreHistory = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < history.length) {
        setHistIdx(idx);
        setState(JSON.parse(history[idx].snap));
      }
    },
    [history]
  );

  // Live animation loop (Drift or Auto-Shuffle)
  useEffect(() => {
    if (!liveOn) return;
    let rafId: number;
    let lastTime = performance.now();
    let shuffleAccumulator = 0;

    const loop = (t: number) => {
      const dt = (t - lastTime) / 1000;
      lastTime = t;

      if (liveMode === 'drift') {
        setState((prev) => ({
          ...prev,
          h: ((prev.h + liveSpeed * 7 * dt) % 360 + 360) % 360,
          s: Math.min(
            92,
            Math.max(45, prev.s + Math.sin(t / 2000) * 0.06 * liveSpeed)
          ),
        }));
      } else {
        shuffleAccumulator += dt;
        if (shuffleAccumulator > 4.2 - liveSpeed * 0.35) {
          shuffleAccumulator = 0;
          randomize();
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [liveOn, liveMode, liveSpeed, randomize]);

  // Global keyboard shortcuts (Space to randomize, Cmd+Z for undo, Cmd+Shift+Z for redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.code === 'Space') {
        e.preventDefault();
        randomize();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [randomize, undo, redo]);

  return (
    <StudioContext.Provider
      value={{
        state,
        derived,
        setState,
        updateState,
        randomize,
        regenSection,
        toggleLock,
        setTheme,
        setHarmony,
        setFormat,
        setScaleMode,
        applyPreset,
        reset,
        undo,
        redo,
        canUndo: histIdx > 0,
        canRedo: histIdx < history.length - 1,
        historyList: history,
        historyIndex: histIdx,
        restoreHistory,
        live: {
          on: liveOn,
          mode: liveMode,
          speed: liveSpeed,
          toggle: () => setLiveOn((prev) => !prev),
          setMode: (mode) => setLiveMode(mode),
          setSpeed: (speed) => setLiveSpeed(speed),
        },
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
