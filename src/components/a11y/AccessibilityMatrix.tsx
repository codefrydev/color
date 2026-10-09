'use client';

import React from 'react';
import { useStudio } from '../../state/StudioContext';
import { getContrast, checkWcag, getApca } from '../../core/color/contrast';
import { hslToRgb, rgbToHex } from '../../core/color/conversions';
import { simulateColorBlindness, VISION_MODES, VisionMode } from '../../core/color/blindness';
import { deltaE76 } from '../../core/color/deltaE';
import { CheckCircle2, AlertTriangle, XCircle, Eye } from 'lucide-react';

export function AccessibilityMatrix() {
  const { state, derived } = useStudio();

  const pairs = [
    { label: 'Primary text on app background', fg: '--text-primary', bg: '--bg-app' },
    { label: 'Primary text on surface card', fg: '--text-primary', bg: '--bg-surface' },
    { label: 'Secondary text on surface', fg: '--text-secondary', bg: '--bg-surface' },
    { label: 'Muted helper text on surface', fg: '--text-muted', bg: '--bg-surface' },
    { label: 'Primary button label', fg: '--btn-primary-text', bg: '--btn-primary-bg' },
    { label: 'Accent button label', fg: '--accent-text', bg: '--accent-bg' },
    { label: 'Success badge text', fg: '--success-text', bg: '--success-bg' },
    { label: 'Warning badge text', fg: '--warning-text', bg: '--warning-bg' },
    { label: 'Danger alert text', fg: '--danger-text', bg: '--danger-bg' },
    { label: 'Interactive Link text', fg: '--link', bg: '--bg-surface' },
  ];

  let passCount = 0;

  const results = pairs.map((pair) => {
    const fgVal = derived.sem[pair.fg]?.c || { h: 0, s: 0, l: 0 };
    const bgVal = derived.sem[pair.bg]?.c || { h: 0, s: 0, l: 100 };
    const fgRgb = hslToRgb(fgVal);
    const bgRgb = hslToRgb(bgVal);

    const ratio = getContrast(fgVal, bgVal);
    const wcag = checkWcag(ratio);
    const apca = getApca(fgRgb, bgRgb);

    if (wcag.aa) passCount++;

    return {
      ...pair,
      ratio,
      wcag,
      apca,
      fgVal,
      bgVal,
    };
  });

  // Color blindness simulation test palette
  const keyColors = [
    { name: 'Primary', rgb: hslToRgb(derived.scales.p[500]) },
    { name: 'Accent', rgb: hslToRgb(derived.scales.a[500]) },
    { name: 'Secondary', rgb: hslToRgb(derived.scales.s[500]) },
    { name: 'Success', rgb: hslToRgb(derived.scales.success[500]) },
    { name: 'Warning', rgb: hslToRgb(derived.scales.warning[500]) },
    { name: 'Danger', rgb: hslToRgb(derived.scales.danger[500]) },
  ];

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center pb-3 bd-b">
        <div>
          <h2 className="text-sm font-bold t-primary flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--p-500)]" />
            Accessibility & Perception Studio
          </h2>
          <p className="text-xs t-muted">
            WCAG 2.2 contrast compliance, APCA ratings, and Machado color-blindness simulation.
          </p>
        </div>
        <div
          className={`badge ${
            passCount === pairs.length
              ? 'b-success'
              : passCount >= pairs.length - 2
              ? 'b-warning'
              : 'b-danger'
          }`}
        >
          {passCount}/{pairs.length} Pass (AA)
        </div>
      </div>

      {/* WCAG & APCA Table */}
      <div className="space-y-2">
        <div className="text-xs font-semibold t-secondary uppercase tracking-wider mb-2">
          Key Interface Contrast Ratios
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {results.map((r, i) => (
            <div
              key={i}
              className="py-2.5 flex items-center gap-3 text-xs"
            >
              {/* Sample Aa chip */}
              <div
                className="w-12 h-8 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 bd shadow-inner"
                style={{
                  background: `var(${r.bg})`,
                  color: `var(${r.fg})`,
                }}
              >
                Aa
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold t-primary truncate">{r.label}</div>
                <div className="font-mono text-[10px] t-muted truncate">
                  {r.fg} on {r.bg}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold t-primary">
                  {r.ratio.toFixed(2)}:1
                </div>
                <div className="font-mono text-[10px] t-muted">
                  APCA Lc {r.apca}
                </div>
              </div>

              <span
                className={`badge w-14 justify-center text-[10px] ${
                  r.wcag.aaa
                    ? 'b-success'
                    : r.wcag.aa
                    ? 'b-info'
                    : 'b-danger'
                }`}
              >
                {r.wcag.aaa ? 'AAA ✓' : r.wcag.aa ? 'AA ✓' : 'Fail'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Color Blindness Simulation Strip */}
      <div className="pt-4 bd-t space-y-3">
        <div className="text-xs font-semibold t-secondary uppercase tracking-wider">
          Color Vision Deficiency Simulation
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VISION_MODES.map((mode) => {
            const simulated = keyColors.map((k) => ({
              name: k.name,
              rgb: simulateColorBlindness(k.rgb, mode),
            }));

            // Check if any colors become confusable under this simulation
            const confusable: string[] = [];
            for (let i = 0; i < simulated.length; i++) {
              for (let j = i + 1; j < simulated.length; j++) {
                if (deltaE76(simulated[i].rgb, simulated[j].rgb) < 12) {
                  confusable.push(`${simulated[i].name} ≈ ${simulated[j].name}`);
                }
              }
            }

            return (
              <div key={mode} className="p-3 rounded-lg bg-app bd space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold t-primary">{mode}</span>
                  <span
                    className={`badge text-[10px] ${
                      confusable.length ? 'b-warning' : 'b-success'
                    }`}
                  >
                    {confusable.length ? `${confusable.length} confusable` : 'Distinct ✓'}
                  </span>
                </div>

                <div className="flex rounded overflow-hidden h-7 shadow-inner">
                  {simulated.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex-1"
                      style={{ background: rgbToHex(s.rgb) }}
                      title={`${s.name} under ${mode}`}
                    />
                  ))}
                </div>

                {confusable.length > 0 && (
                  <div className="text-[10px] font-mono t-muted truncate">
                    {confusable.join(' · ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
