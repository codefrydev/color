'use client';

import React, { useState } from 'react';
import { useStudio } from '../../state/StudioContext';
import { hexToHsl } from '../../core/color/conversions';
import { ChevronDown, ChevronUp, Lock, Unlock, SlidersHorizontal, Sparkles } from 'lucide-react';

export function Sliders() {
  const { state, derived, updateState, toggleLock, regenSection } = useStudio();
  const [showTuning, setShowTuning] = useState(true);
  const [showTokens, setShowTokens] = useState(true);

  const hexInput = derived.meta.hex.toUpperCase();

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(val)) {
      const hsl = hexToHsl(val);
      updateState(
        {
          h: Math.round(hsl.h),
          s: Math.round(hsl.s),
          l: Math.round(hsl.l),
        },
        `Hex Input → ${val}`
      );
    }
  };

  const hueGradient = `linear-gradient(90deg, ${Array.from(
    { length: 13 },
    (_, i) => `hsl(${i * 30} ${state.s}% ${state.l}%)`
  ).join(',')})`;

  const satGradient = `linear-gradient(90deg, hsl(${state.h} 0% ${state.l}%), hsl(${state.h} 100% ${state.l}%))`;

  const lightGradient = `linear-gradient(90deg, hsl(${state.h} ${state.s}% 15%), hsl(${state.h} ${state.s}% 50%), hsl(${state.h} ${state.s}% 85%))`;

  return (
    <div className="space-y-5">
      {/* Hex Picker Box */}
      <div className="card card-tight flex items-center gap-3">
        <label className="relative w-12 h-12 rounded-lg cursor-pointer overflow-hidden bd flex-shrink-0 shadow-sm">
          <input
            type="color"
            value={derived.meta.hex}
            onChange={(e) => {
              const hsl = hexToHsl(e.target.value);
              updateState(
                {
                  h: Math.round(hsl.h),
                  s: Math.round(hsl.s),
                  l: Math.round(hsl.l),
                },
                `Picker → ${e.target.value}`
              );
            }}
            className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0"
          />
          <div
            className="w-full h-full"
            style={{ background: derived.meta.hex }}
          />
        </label>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold t-primary">Base Hex Code</div>
          <input
            type="text"
            defaultValue={hexInput}
            key={hexInput}
            onBlur={handleHexChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleHexChange(e as any);
              }
            }}
            className="input font-mono uppercase font-bold text-sm mt-1"
            maxLength={7}
          />
        </div>

        <button
          onClick={() => regenSection('primary')}
          className="btn btn-secondary btn-sm h-10 px-3"
          title="Regenerate Primary Hue"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>
      </div>

      {/* Primary HSL Sliders */}
      <div className="card card-tight space-y-4">
        {/* Hue */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="font-semibold t-primary">Hue</span>
            <span className="font-mono t-secondary px-2 py-0.5 rounded bg-app bd">
              {Math.round(state.h)}°
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={state.h}
            style={{ background: hueGradient }}
            onChange={(e) =>
              updateState({ h: parseFloat(e.target.value) }, 'Hue Slider')
            }
          />
        </div>

        {/* Saturation */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="font-semibold t-primary">Saturation</span>
            <span className="font-mono t-secondary px-2 py-0.5 rounded bg-app bd">
              {Math.round(state.s)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={state.s}
            style={{ background: satGradient }}
            onChange={(e) =>
              updateState({ s: parseFloat(e.target.value) }, 'Saturation Slider')
            }
          />
        </div>

        {/* Lightness */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="font-semibold t-primary">Lightness</span>
            <span className="font-mono t-secondary px-2 py-0.5 rounded bg-app bd">
              {Math.round(state.l)}%
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={85}
            value={state.l}
            style={{ background: lightGradient }}
            onChange={(e) =>
              updateState({ l: parseFloat(e.target.value) }, 'Lightness Slider')
            }
          />
        </div>
      </div>

      {/* Fine-Tuning Accordion */}
      <div className="card card-tight">
        <button
          type="button"
          onClick={() => setShowTuning(!showTuning)}
          className="w-full flex items-center justify-between text-xs font-semibold t-primary pb-2 bd-b cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Harmonic Tuning & Bias</span>
          </div>
          {showTuning ? (
            <ChevronUp className="w-4 h-4 t-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 t-muted" />
          )}
        </button>

        {showTuning && (
          <div className="space-y-3.5 pt-3">
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Saturation Boost</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Accent Rotation</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Neutral Brand Tint</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Neutral Hue Offset</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Status Colors Pull</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>
          </div>
        )}
      </div>

      {/* Token Tuning Accordion */}
      <div className="card card-tight">
        <div className="w-full flex items-center justify-between text-xs font-semibold t-primary pb-2 bd-b">
          <button
            type="button"
            onClick={() => setShowTokens(!showTokens)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--p-500)' }} />
            <span>Design Tokens (Radius & Shadows)</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleLock('tokens')}
              className="p-1 hover:opacity-75 t-muted cursor-pointer"
              title={state.locks.tokens ? 'Tokens locked' : 'Tokens unlocked'}
            >
              {state.locks.tokens ? (
                <Lock className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowTokens(!showTokens)}
              className="p-1 hover:opacity-75 t-muted cursor-pointer"
            >
              {showTokens ? (
                <ChevronUp className="w-4 h-4 t-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 t-muted" />
              )}
            </button>
          </div>
        </div>

        {showTokens && (
          <div className="space-y-3.5 pt-3">
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Border Radius</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Spacing Factor</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Shadow Intensity</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Type Scale Multiplier</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="t-secondary">Line Height Rhythm</span>
                <span className="font-mono t-primary text-[11px]">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
