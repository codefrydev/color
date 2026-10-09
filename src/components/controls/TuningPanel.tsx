'use client';

import React from 'react';
import { useStudio } from '../../state/StudioContext';
import { SlidersHorizontal, Ruler, Lock, Unlock, RotateCcw } from 'lucide-react';

export function TuningPanel() {
  const { state, updateState, toggleLock, regenSection } = useStudio();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Card 1: Harmonic Tuning */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center pb-2 bd-b">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--p-500)]" />
            <h3 className="text-xs font-bold t-primary uppercase tracking-wider">
              Harmonic Tuning & Bias
            </h3>
          </div>
          <button
            onClick={() => regenSection('neutral')}
            className="btn btn-ghost btn-sm h-7 px-2 t-muted"
            title="Randomize tuning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Saturation Boost</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.satBoost.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.4}
              step={0.05}
              value={state.satBoost}
              onChange={(e) =>
                updateState({ satBoost: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Multiplies saturation across all generated scales
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Accent Hue Rotation</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.accentShift > 0 ? '+' : ''}
                {state.accentShift}°
              </span>
            </div>
            <input
              type="range"
              min={-60}
              max={60}
              step={1}
              value={state.accentShift}
              onChange={(e) =>
                updateState({ accentShift: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Fine-rotates accent hues around the geometric harmony angle
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Neutral Brand Tint</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.neutralTint}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={state.neutralTint}
              onChange={(e) =>
                updateState({ neutralTint: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Controls how much primary brand color leaks into greys
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Neutral Hue Offset</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.neutralHue > 0 ? '+' : ''}
                {state.neutralHue}°
              </span>
            </div>
            <input
              type="range"
              min={-90}
              max={90}
              step={1}
              value={state.neutralHue}
              onChange={(e) =>
                updateState({ neutralHue: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Warm-shift or cool-shift greys relative to primary
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Status Colors Brand Pull</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.semPull}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={state.semPull}
              onChange={(e) =>
                updateState({ semPull: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Pulls success, warning, danger, and info towards brand hue
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Design Tokens Tuning */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center pb-2 bd-b">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[var(--a-500)]" />
            <h3 className="text-xs font-bold t-primary uppercase tracking-wider">
              Design Tokens (Radius & Shadows)
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleLock('tokens')}
              className={`btn btn-ghost btn-sm h-7 px-2 ${
                state.locks.tokens ? 'text-amber-500 font-bold' : 't-muted'
              }`}
              title={state.locks.tokens ? 'Tokens locked' : 'Lock tokens'}
            >
              {state.locks.tokens ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => regenSection('tokens')}
              className="btn btn-ghost btn-sm h-7 px-2 t-muted"
              title="Regenerate token values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Border Radius Multiplier</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.radius.toFixed(1)}×
              </span>
            </div>
            <input
              type="range"
              min={0.3}
              max={2.2}
              step={0.1}
              value={state.radius}
              onChange={(e) =>
                updateState({ radius: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Corner roundness from sharp/brutalist to pill/organic
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Spacing Multiplier</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.spacing.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.6}
              step={0.05}
              value={state.spacing}
              onChange={(e) =>
                updateState({ spacing: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Card padding, button insets, and grid gaps
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Elevation Shadow Intensity</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.shadow.toFixed(1)}×
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2.5}
              step={0.1}
              value={state.shadow}
              onChange={(e) =>
                updateState({ shadow: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Layered multi-stop box shadows with ambient brand tinting
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Typography Scale Factor</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.type.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              min={0.85}
              max={1.3}
              step={0.01}
              value={state.type}
              onChange={(e) =>
                updateState({ type: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Font size progression across headings and body text
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="t-secondary font-medium">Line Height Rhythm</span>
              <span className="font-mono t-primary text-[11px] font-bold">
                {state.leading.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={1.2}
              max={1.9}
              step={0.05}
              value={state.leading}
              onChange={(e) =>
                updateState({ leading: parseFloat(e.target.value) })
              }
            />
            <span className="text-[10px] t-muted block mt-0.5">
              Reading rhythm and paragraph vertical spacing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
