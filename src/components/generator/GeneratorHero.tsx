'use client';

import React, { useState } from 'react';
import { useStudio } from '../../state/StudioContext';
import { ColorWheel } from '../controls/ColorWheel';
import { HARMONIES, HarmonyMode } from '../../core/engine/harmonies';
import { hexToHsl, mod } from '../../core/color/conversions';
import {
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  History,
} from 'lucide-react';

export function GeneratorHero() {
  const {
    state,
    derived,
    updateState,
    randomize,
    reset,
    setHarmony,
    historyList,
    historyIndex,
    restoreHistory,
    live,
  } = useStudio();

  const [showTuningDrawer, setShowTuningDrawer] = useState(false);

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
        `Typed ${val}`
      );
    }
  };

  const hueGrad = `linear-gradient(90deg, ${Array.from(
    { length: 13 },
    (_, i) => `hsl(${i * 30} ${state.s}% ${state.l}%)`
  ).join(',')})`;

  const satGrad = `linear-gradient(90deg, hsl(${state.h} 0% ${state.l}%), hsl(${state.h} 100% ${state.l}%))`;

  const lightGrad = `linear-gradient(90deg, hsl(${state.h} ${state.s}% 15%), hsl(${state.h} ${state.s}% 50%), hsl(${state.h} ${state.s}% 85%))`;

  const harmonyKeys = Object.keys(HARMONIES) as HarmonyMode[];

  return (
    <div className="card space-y-4 shadow-sm bd">
      {/* Workbench Header */}
      <div className="flex items-center justify-between pb-2 bd-b">
        <div className="flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[11px] font-bold shadow-2xs"
            style={{ background: 'var(--p-500)' }}
          >
            ✦
          </span>
          <h2 className="font-bold text-sm t-primary">Color Engine</h2>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-app bd t-secondary uppercase">
            {state.scaleMode}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => randomize()}
            className="btn btn-primary btn-sm h-7 px-2.5 text-xs font-semibold gap-1"
            title="Randomize harmonic seed"
          >
            <Sparkles className="w-3 h-3" />
            <span>Random</span>
          </button>
          <button
            onClick={reset}
            className="btn btn-secondary btn-sm h-7 px-2"
            title="Reset to defaults"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Base Hex & Native Swatch Row */}
      <div className="flex items-center gap-3">
        {/* Circular Native Color Swatch */}
        <label className="relative w-10 h-10 rounded-xl cursor-pointer overflow-hidden bd shadow-xs flex-shrink-0 group">
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
                `Picked ${e.target.value}`
              );
            }}
            className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0"
          />
          <div
            className="w-full h-full rounded-xl transition-transform group-hover:scale-105"
            style={{ background: derived.meta.hex }}
          />
        </label>

        {/* Base HEX Input */}
        <div className="flex-1 min-w-0">
          <label className="text-[10px] font-bold uppercase tracking-wider t-muted block mb-0.5">
            Base HEX
          </label>
          <div className="relative">
            <input
              type="text"
              defaultValue={hexInput}
              key={hexInput}
              onBlur={handleHexChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleHexChange(e as any);
              }}
              className="input font-mono uppercase font-semibold text-xs h-8 !py-1 w-full"
              maxLength={7}
            />
          </div>
        </div>

        {/* Current Angle Pill */}
        <div className="text-right flex-shrink-0">
          <label className="text-[10px] font-bold uppercase tracking-wider t-muted block mb-0.5">
            Polar Angle
          </label>
          <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-app bd t-secondary inline-block">
            {Math.round(state.h)}°
          </span>
        </div>
      </div>

      {/* Interactive Color Wheel */}
      <div className="py-1 flex flex-col items-center justify-center bg-app/40 rounded-xl bd p-2">
        <ColorWheel />
      </div>

      {/* Precision Sliders */}
      <div className="space-y-2.5 pt-1">
        {/* Hue Slider */}
        <div>
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold t-primary text-[11px]">Hue</span>
            <span className="font-mono t-secondary text-[10px] px-1.5 py-0.2 rounded bg-app bd">
              {Math.round(state.h)}°
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={state.h}
            style={{ background: hueGrad }}
            onChange={(e) =>
              updateState({ h: parseFloat(e.target.value) }, 'Hue Slider')
            }
          />
        </div>

        {/* Saturation Slider */}
        <div>
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold t-primary text-[11px]">
              Saturation
            </span>
            <span className="font-mono t-secondary text-[10px] px-1.5 py-0.2 rounded bg-app bd">
              {Math.round(state.s)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={state.s}
            style={{ background: satGrad }}
            onChange={(e) =>
              updateState({ s: parseFloat(e.target.value) }, 'Saturation Slider')
            }
          />
        </div>

        {/* Lightness Slider */}
        <div>
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold t-primary text-[11px]">
              Lightness
            </span>
            <span className="font-mono t-secondary text-[10px] px-1.5 py-0.2 rounded bg-app bd">
              {Math.round(state.l)}%
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={85}
            value={state.l}
            style={{ background: lightGrad }}
            onChange={(e) =>
              updateState({ l: parseFloat(e.target.value) }, 'Lightness Slider')
            }
          />
        </div>
      </div>

      {/* Harmony Modes (Compact Grid) */}
      <div className="space-y-1.5 pt-1 bd-t">
        <span className="text-[10px] font-bold uppercase tracking-wider t-muted block">
          Color Harmony
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5">
          {harmonyKeys.map((k) => {
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
                className={`btn btn-secondary !p-1.5 !justify-between !items-center text-left transition-all ${
                  isSelected
                    ? 'on ring-1 ring-[var(--p-500)] bg-[var(--nav-active-bg)]'
                    : ''
                }`}
                title={h.label}
              >
                <span className="text-[11px] font-semibold truncate leading-tight">
                  {h.label}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {hues.map(([hue, factor], i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full shadow-2xs"
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

      {/* Live Drift & Playback Controls */}
      <div className="rounded-xl p-2.5 bg-app bd space-y-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={live.toggle}
            className={`btn btn-sm h-7 px-2 text-xs font-semibold ${
              live.on ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {live.on ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Drift</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => live.setMode('drift')}
              className={`btn btn-sm h-7 px-2 text-[10px] ${
                live.mode === 'drift' ? 'btn-secondary on' : 'btn-ghost'
              }`}
            >
              Drift
            </button>
            <button
              onClick={() => live.setMode('shuffle')}
              className={`btn btn-sm h-7 px-2 text-[10px] ${
                live.mode === 'shuffle' ? 'btn-secondary on' : 'btn-ghost'
              }`}
            >
              Shuffle
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-mono t-muted">{live.speed}x</span>
            <input
              type="range"
              min={1}
              max={10}
              value={live.speed}
              onChange={(e) => live.setSpeed(parseInt(e.target.value, 10))}
              className="w-16"
              title="Drift speed"
            />
          </div>
        </div>
      </div>

      {/* Quick Harmonic Tuning Accordion */}
      <div className="bd-t pt-2">
        <button
          onClick={() => setShowTuningDrawer(!showTuningDrawer)}
          className="w-full flex items-center justify-between py-1 text-xs font-semibold t-secondary hover:t-primary"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--p-500)]" />
            <span>Harmonic Bias & Saturation Tuning</span>
          </span>
          {showTuningDrawer ? (
            <ChevronUp className="w-3.5 h-3.5 t-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 t-muted" />
          )}
        </button>

        {showTuningDrawer && (
          <div className="mt-2.5 space-y-2.5 p-3 rounded-xl bg-app bd text-xs animate-in slide-in-from-top-1 duration-150">
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[11px] t-secondary font-medium">
                  Saturation Boost
                </span>
                <span className="font-mono text-[10px] font-bold t-primary">
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
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[11px] t-secondary font-medium">
                  Accent Hue Rotation
                </span>
                <span className="font-mono text-[10px] font-bold t-primary">
                  {state.accentShift > 0 ? '+' : ''}
                  {state.accentShift}°
                </span>
              </div>
              <input
                type="range"
                min={-60}
                max={60}
                step={5}
                value={state.accentShift}
                onChange={(e) =>
                  updateState({ accentShift: parseInt(e.target.value, 10) })
                }
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[11px] t-secondary font-medium">
                  Neutral Tint
                </span>
                <span className="font-mono text-[10px] font-bold t-primary">
                  {state.neutralTint}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={2}
                value={state.neutralTint}
                onChange={(e) =>
                  updateState({ neutralTint: parseInt(e.target.value, 10) })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Snapshot History Chips */}
      {historyList.length > 0 && (
        <div className="bd-t pt-2 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider t-muted">
            <span className="flex items-center gap-1">
              <History className="w-3 h-3" />
              Recent Snapshots
            </span>
            <span>{historyList.length}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {historyList.map((h, i) => (
              <button
                key={i}
                onClick={() => restoreHistory(i)}
                className={`hist-chip ${i === historyIndex ? 'cur' : ''}`}
                title={h.label}
              >
                <i style={{ background: h.hex }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
