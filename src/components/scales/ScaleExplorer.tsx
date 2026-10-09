'use client';

import React, { useState } from 'react';
import { useStudio } from '../../state/StudioContext';
import { formatColor } from '../../core/color/conversions';
import { ScaleKey, STOPS, ColorStop } from '../../core/engine/types';
import { Lock, Unlock, RotateCcw, Copy, Check } from 'lucide-react';

interface ScaleDef {
  key: ScaleKey;
  name: string;
  lockKey?: 'primary' | 'accent' | 'neutral' | 'semantic';
}

const SCALE_GROUPS: ScaleDef[] = [
  { key: 'p', name: 'Primary Scale', lockKey: 'primary' },
  { key: 'a', name: 'Accent Scale', lockKey: 'accent' },
  { key: 's', name: 'Secondary Scale', lockKey: 'accent' },
  { key: 'n', name: 'Neutral Scale', lockKey: 'neutral' },
];

const SEM_GROUPS: ScaleDef[] = [
  { key: 'success', name: 'Success' },
  { key: 'warning', name: 'Warning' },
  { key: 'danger', name: 'Danger' },
  { key: 'info', name: 'Info' },
];

export function ScaleExplorer() {
  const { state, derived, toggleLock, regenSection } = useStudio();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyColor = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const renderScaleRow = (sc: ScaleDef, isCompact = false) => {
    const scale = derived.scales[sc.key];
    const isLocked = sc.lockKey ? state.locks[sc.lockKey] : false;

    return (
      <div key={sc.key} className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold t-primary">{sc.name}</span>
            <span className="font-mono t-muted text-[11px] hidden sm:inline">
              --{sc.key}-50 … --{sc.key}-950
            </span>
          </div>

          <div className="flex items-center gap-1">
            {sc.lockKey && (
              <button
                onClick={() => toggleLock(sc.lockKey!)}
                className={`btn btn-ghost btn-sm h-7 px-2 ${
                  isLocked ? 'text-amber-500 font-bold' : 't-muted'
                }`}
                title={isLocked ? 'Scale locked' : 'Lock scale'}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {sc.lockKey && (
              <button
                onClick={() => regenSection(sc.lockKey!)}
                className="btn btn-ghost btn-sm h-7 px-2 t-muted"
                title="Regenerate this scale"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 11 Stop swatches */}
        <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
          {STOPS.map((stop) => {
            const hsl = scale[stop];
            const colorStr = formatColor(hsl, state.format);
            const isDarkColor = hsl.l < 55;
            const fullKey = `${sc.key}-${stop}`;
            const usage = derived.meta.usage[fullKey];
            const isCopied = copiedKey === fullKey;

            return (
              <button
                key={stop}
                onClick={() => copyColor(colorStr, fullKey)}
                title={
                  usage
                    ? `${fullKey} (${colorStr})\nUsed by: ${usage.join(', ')}`
                    : `${fullKey} (${colorStr}) — Click to copy`
                }
                className="swatch group"
                style={{
                  background: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
                  color: isDarkColor ? '#ffffff' : '#0f172a',
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold">{stop}</span>
                  {isCopied && <Check className="w-3 h-3 text-emerald-400" />}
                </div>

                <div className="flex flex-col items-start truncate w-full text-[9px] opacity-90 group-hover:opacity-100">
                  <span className="truncate w-full font-mono font-medium">
                    {colorStr.replace(/^(hsl|rgb|oklch)\(/, '').replace(/\)$/, '')}
                  </span>
                  {usage && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center pb-3 bd-b">
        <div>
          <h2 className="text-sm font-bold t-primary">Harmonic Palette Scales</h2>
          <p className="text-xs t-muted">
            50-950 luminance curves. Click any swatch to copy value in {state.format.toUpperCase()}.
          </p>
        </div>
        <div className="badge b-info">
          {state.scaleMode.toUpperCase()} mode
        </div>
      </div>

      <div className="space-y-5">
        {SCALE_GROUPS.map((sc) => renderScaleRow(sc))}
      </div>

      <div className="pt-4 bd-t space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold t-secondary uppercase tracking-wider">
            Semantic Feedback Scales
          </span>
          <button
            onClick={() => regenSection('semantic')}
            className="btn btn-ghost btn-sm h-7 px-2 t-muted"
            title="Regenerate semantic status colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset status</span>
          </button>
        </div>
        <div className="space-y-4">
          {SEM_GROUPS.map((sc) => renderScaleRow(sc, true))}
        </div>
      </div>
    </div>
  );
}
