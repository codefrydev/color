'use client';

import React from 'react';
import { useStudio } from '../../state/StudioContext';
import { HARMONIES, HarmonyMode } from '../../core/engine/harmonies';
import { mod } from '../../core/color/conversions';

export function HarmonySelector() {
  const { state, derived, setHarmony } = useStudio();
  const keys = Object.keys(HARMONIES) as HarmonyMode[];

  return (
    <div className="card card-tight">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold t-primary">Color Harmonies</span>
        <span className="text-[11px] t-muted">Geometric rules</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {keys.map((k) => {
          const h = HARMONIES[k];
          const isSelected = state.harmony === k;
          const monoK = k === 'monochrome' ? 0.55 : 1;

          const hues = [
            [state.h, 1],
            [mod(state.h + h.a + state.accentShift), monoK],
            [mod(state.h + h.b + state.accentShift), 0.85 * monoK],
          ];

          return (
            <button
              key={k}
              onClick={() => setHarmony(k)}
              className={`btn btn-secondary !flex-col !items-start !justify-start !p-2.5 text-left transition-all ${
                isSelected ? 'active ring-2 ring-[var(--border-focus)]' : ''
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-xs font-bold leading-none">{h.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--p-500)]" />
                )}
              </div>

              {/* Swatch dots preview */}
              <div className="flex items-center gap-1.5">
                {hues.map(([hue, factor], i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full shadow-inner"
                    style={{
                      background: `hsl(${hue} ${derived.meta.ps * factor}% 52%)`,
                    }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
