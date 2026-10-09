'use client';

import { useStudio } from '../../state/StudioContext';
import { Pipette, Compass, Layers, Wand2, Ruler } from 'lucide-react';

export function DerivationPipeline() {
  const { state, derived } = useStudio();
  const m = derived.meta;

  const steps = [
    {
      title: 'Input Analysis',
      icon: Pipette,
      items: [
        { label: 'HEX Code', val: m.hex.toUpperCase() },
        { label: 'RGB Values', val: `${m.rgb.r}, ${m.rgb.g}, ${m.rgb.b}` },
        { label: 'Psychology', val: m.psych },
        { label: 'Temperature', val: m.temp },
      ],
    },
    {
      title: 'Harmony Derivation',
      icon: Compass,
      items: [
        { label: 'Mode', val: state.harmony.toUpperCase() },
        { label: 'Primary Hue', val: `${Math.round(state.h)}°` },
        { label: 'Accent Hue', val: `${Math.round(m.aH)}°` },
        { label: 'ΔE (P↔A)', val: `${m.deltaPA.toFixed(1)} (Perceptual)` },
      ],
    },
    {
      title: 'Scale Synthesis',
      icon: Layers,
      items: [
        { label: 'Saturation Floor', val: `${Math.round(m.ps)}%` },
        { label: 'Neutral Tint / Hue', val: `${m.nS}% / ${Math.round(m.nH)}°` },
        { label: 'Status Hue Shift', val: `${state.semPull}% Brand Pull` },
        { label: 'Scale Mode', val: state.scaleMode.toUpperCase() },
      ],
    },
    {
      title: 'Accessibility Picks',
      icon: Wand2,
      items: [
        { label: 'Contrast Target', val: `${state.contrast}:1 (${state.contrast >= 7 ? 'AAA' : 'AA'})` },
        { label: 'Button Stop', val: `p-${m.picks.btn?.stop || 600} (${m.picks.btn?.ratio.toFixed(1)}:1)` },
        { label: 'Secondary Text', val: `n-${m.picks.textSecondary?.stop || 600}` },
        { label: 'Muted Text', val: `n-${m.picks.textMuted?.stop || 500}` },
      ],
    },
    {
      title: 'Design Tokens',
      icon: Ruler,
      items: [
        { label: 'Radius Factor', val: `${m.roundness.toFixed(2)} × ${state.radius.toFixed(1)}` },
        { label: 'Spacing Factor', val: `${m.spaceF.toFixed(2)} × ${state.spacing.toFixed(2)}` },
        { label: 'Type Multiplier', val: `${m.typeF.toFixed(2)}×` },
        { label: 'Elevation Softness', val: `${m.soft.toFixed(2)} / ${m.shA.toFixed(2)}` },
      ],
    },
  ];

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center pb-3 bd-b">
        <div>
          <h2 className="text-sm font-bold t-primary">Derivation Engine Pipeline</h2>
          <p className="text-xs t-muted">
            Step-by-step mathematical translation from base hue to full design system tokens.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="card-tight bg-app bd rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-[var(--accent-soft-bg)] text-[var(--accent-soft-text)]">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold t-primary truncate">{s.title}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {s.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className="t-secondary truncate">{it.label}</span>
                    <span className="font-mono font-medium t-primary ml-1 truncate">
                      {it.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
